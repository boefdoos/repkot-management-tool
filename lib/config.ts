// lib/config.ts - Updated with separate pricing structure
export interface StudioConfig {
  id: string;
  name: string;
  size: number; // m²
  hourlyRate: number;
  dayRate: number;     // Separate pricing for day parts
  monthlyRate: number; // Separate pricing for monthly subscriptions
  maxCapacity: number;
}

export interface LockerConfig {
  monthlyRate: number;
  totalCount: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface BusinessConfig {
  studios: StudioConfig[];
  lockers: LockerConfig;
  operationalCosts: {
    rent: number;
    utilities: number;
    insurance: number;
    maintenance: number;
    administration: number;
    marketing: number;
    bookingSystem: number;
    security: number;
    access: number;
    cleaning: number;
    copyrightFees: number;
    waste: number;
    reserves: number;
    miscellaneous: number;
  };
  discounts: {
    student: number; // percentage
    bulk: number; // percentage
  };
  breakEven: {
    targetMonthlyRevenue: number;
    minimumOccupancyRate: number;
  };
  partners: {
    count: number;
    profitSplitPercentage: number;
  };
}

// Standaard configuratie gebaseerd op je businessplan
export const defaultConfig: BusinessConfig = {
  studios: [
    {
      id: 'studio-a',
      name: 'Studio A',
      size: 20,
      hourlyRate: 10,
      dayRate: 40,        // €40 per dagdeel (3 uur)
      monthlyRate: 160,   // €160 per maandabonnement
      maxCapacity: 6
    },
    {
      id: 'studio-b', 
      name: 'Studio B',
      size: 20,
      hourlyRate: 10,
      dayRate: 40,
      monthlyRate: 160,
      maxCapacity: 6
    },
    {
      id: 'studio-c',
      name: 'Studio C', 
      size: 15,
      hourlyRate: 8,
      dayRate: 32,        // €32 per dagdeel
      monthlyRate: 128,   // €128 per maandabonnement
      maxCapacity: 4
    }
  ],
  lockers: {
    monthlyRate: 40,
    totalCount: 8,
    dimensions: {
      width: 100,
      height: 200,
      depth: 260
    }
  },
  operationalCosts: {
    rent: 550,
    utilities: 200,
    insurance: 120,
    maintenance: 100,
    administration: 20,
    marketing: 20,
    bookingSystem: 50,
    security: 30,
    access: 40,
    cleaning: 80,
    copyrightFees: 50,
    waste: 20,
    reserves: 70,
    miscellaneous: 50
  },
  discounts: {
    student: 10,
    bulk: 15
  },
  breakEven: {
    targetMonthlyRevenue: 1400,
    minimumOccupancyRate: 58
  },
  partners: {
    count: 2,
    profitSplitPercentage: 50
  }
};

// Helper functies voor berekeningen
export class BusinessCalculator {
  constructor(private config: BusinessConfig) {}

  getTotalMonthlyCosts(): number {
    return Object.values(this.config.operationalCosts).reduce((sum, cost) => sum + cost, 0);
  }

  // Bereken maximale omzet gebaseerd op realistische scenario's
  getMaxMonthlyRevenue(): number {
    // Realistische berekening: maandabonnees + losse verhuur + lockers
    const maxSubscriptionRevenue = this.config.studios.reduce((sum, studio) => {
      // Assumptie: 4 maandabonnees per studio mogelijk
      return sum + (studio.monthlyRate * 4);
    }, 0);
    
    // Losse verhuur: gemiddeld 2 dagdelen per week per studio (8 per maand)
    const casualRevenue = this.config.studios.reduce((sum, studio) => {
      return sum + (studio.dayRate * 8);
    }, 0);
    
    const lockerRevenue = this.config.lockers.totalCount * this.config.lockers.monthlyRate;
    
    return maxSubscriptionRevenue + casualRevenue + lockerRevenue;
  }

  // Bereken break-even bezetting voor maandabonnement model
  calculateBreakEvenOccupancy(): number {
    const requiredRevenue = this.getTotalMonthlyCosts();
    const maxSubscriptionRevenue = this.config.studios.reduce((sum, studio) => {
      return sum + (studio.monthlyRate * 4); // 4 abonnees per studio
    }, 0);
    
    return (requiredRevenue / maxSubscriptionRevenue) * 100;
  }

  calculateMonthlyProfit(actualRevenue: number): number {
    return actualRevenue - this.getTotalMonthlyCosts();
  }

  calculateProfitPerPartner(monthlyProfit: number): number {
    return (monthlyProfit * this.config.partners.profitSplitPercentage) / 100 / this.config.partners.count;
  }

  // Scenario berekeningen aangepast voor nieuwe prijsstructuur
  calculateScenario(subscriptionOccupancy: number, lockerOccupancy: number) {
    // Bereken subscription revenue (maandabonnees)
    const maxSubscribers = this.config.studios.length * 4; // 4 per studio
    const actualSubscribers = Math.round(maxSubscribers * (subscriptionOccupancy / 100));
    
    let subscriptionRevenue = 0;
    let subscribersLeft = actualSubscribers;
    
    for (const studio of this.config.studios) {
      const studioSubscribers = Math.min(subscribersLeft, 4);
      subscriptionRevenue += studioSubscribers * studio.monthlyRate;
      subscribersLeft -= studioSubscribers;
    }

    // Losse verhuur (dagdelen) - overige capaciteit
    const casualRevenue = this.config.studios.reduce((sum, studio) => {
      const availableDays = Math.max(0, 20 - (Math.min(4, actualSubscribers) * 4)); // 20 dagdelen per maand - bezet door abonnees
      const casualBookings = Math.round(availableDays * 0.3); // 30% van overige slots wordt losjes geboekt
      return sum + (casualBookings * studio.dayRate);
    }, 0);

    // Locker revenue
    const occupiedLockers = Math.floor(this.config.lockers.totalCount * (lockerOccupancy / 100));
    const lockerRevenue = occupiedLockers * this.config.lockers.monthlyRate;
    
    const totalRevenue = subscriptionRevenue + casualRevenue + lockerRevenue;
    const profit = this.calculateMonthlyProfit(totalRevenue);
    const profitPerPartner = this.calculateProfitPerPartner(profit);

    return {
      totalRevenue,
      subscriptionRevenue,
      casualRevenue,
      lockerRevenue,
      profit,
      profitPerPartner,
      occupancyRate: subscriptionOccupancy,
      lockerOccupancy,
      subscribers: actualSubscribers
    };
  }

  // Helper om juiste tarief te krijgen voor boekingstype
  getStudioRate(studioId: string, bookingType: 'hourly' | 'daily' | 'monthly'): number {
    const studio = this.config.studios.find(s => s.id === studioId);
    if (!studio) return 0;

    switch (bookingType) {
      case 'hourly':
        return studio.hourlyRate;
      case 'daily':
        return studio.dayRate;
      case 'monthly':
        return studio.monthlyRate;
      default:
        return studio.hourlyRate;
    }
  }

  // Bereken prijs voor specifieke boeking
  calculateBookingPrice(studioId: string, bookingType: 'hourly' | 'daily' | 'monthly', duration: number = 1): number {
    const studio = this.config.studios.find(s => s.id === studioId);
    if (!studio) return 0;

    switch (bookingType) {
      case 'hourly':
        return studio.hourlyRate * duration;
      case 'daily':
        return studio.dayRate * duration; // duration = aantal dagdelen
      case 'monthly':
        return studio.monthlyRate; // duration niet relevant voor maandabonnement
      default:
        return 0;
    }
  }
}
