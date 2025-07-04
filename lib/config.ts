// lib/config.ts
export interface StudioConfig {
  id: string;
  name: string;
  size: number; // m²
  hourlyRate: number;
  dayRate: number; // voor 4-uur dagdeel
  monthlyRate: number; // voor 2 dagdelen per week (32u/maand)
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

// Standaard configuratie gebaseerd op je businessplan - aangepast voor 4-uur dagdelen
export const defaultConfig: BusinessConfig = {
  studios: [
    {
      id: 'studio-a',
      name: 'Studio A',
      size: 20,
      hourlyRate: 10,
      dayRate: 40, // 4 uur × €10
      monthlyRate: 160, // 2 dagdelen/week × 4 weken × €40
      maxCapacity: 6
    },
    {
      id: 'studio-b', 
      name: 'Studio B',
      size: 20,
      hourlyRate: 10,
      dayRate: 40, // 4 uur × €10
      monthlyRate: 160, // 2 dagdelen/week × 4 weken × €40
      maxCapacity: 6
    },
    {
      id: 'studio-c',
      name: 'Studio C', 
      size: 15,
      hourlyRate: 8,
      dayRate: 32, // 4 uur × €8
      monthlyRate: 128, // 2 dagdelen/week × 4 weken × €32
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

  getMaxMonthlyRevenue(): number {
    const studioRevenue = this.config.studios.reduce((sum, studio) => {
      // Aanname: 30 dagen * 3 dagdelen per dag (Ochtend, Middag, Avond) = 90 dagdelen/maand
      // Elke dagdeel is 4 uur, dus 360 uur per maand per studio
      const maxDagdelen = 30 * 3; // 90 dagdelen per maand
      return sum + (maxDagdelen * studio.dayRate);
    }, 0);
    
    const lockerRevenue = this.config.lockers.totalCount * this.config.lockers.monthlyRate;
    
    return studioRevenue + lockerRevenue;
  }

  calculateBreakEvenOccupancy(): number {
    const maxRevenue = this.getMaxMonthlyRevenue();
    const requiredRevenue = this.getTotalMonthlyCosts();
    return (requiredRevenue / maxRevenue) * 100;
  }

  calculateMonthlyProfit(actualRevenue: number): number {
    return actualRevenue - this.getTotalMonthlyCosts();
  }

  calculateProfitPerPartner(monthlyProfit: number): number {
    return (monthlyProfit * this.config.partners.profitSplitPercentage) / 100 / this.config.partners.count;
  }

  // Scenario berekeningen aangepast voor 4-uur dagdelen
  calculateScenario(occupancyRate: number, lockerOccupancy: number) {
    // 3 studios × 30 dagen × 3 dagdelen per dag = 270 totaal dagdelen beschikbaar per maand
    const totalDagdelenAvailable = this.config.studios.length * 30 * 3;
    const usedDagdelen = totalDagdelenAvailable * (occupancyRate / 100);
    
    let studioRevenue = 0;
    let remainingDagdelen = usedDagdelen;
    
    // Verdeel dagdelen over studios (proportioneel naar tarief)
    for (const studio of this.config.studios) {
      const studioDagdelen = Math.min(remainingDagdelen, 30 * 3); // max 90 dagdelen per studio
      studioRevenue += studioDagdelen * studio.dayRate;
      remainingDagdelen -= studioDagdelen;
    }

    const lockerRevenue = Math.floor(this.config.lockers.totalCount * (lockerOccupancy / 100)) * this.config.lockers.monthlyRate;
    
    const totalRevenue = studioRevenue + lockerRevenue;
    const profit = this.calculateMonthlyProfit(totalRevenue);
    const profitPerPartner = this.calculateProfitPerPartner(profit);

    return {
      totalRevenue,
      studioRevenue,
      lockerRevenue,
      profit,
      profitPerPartner,
      occupancyRate,
      lockerOccupancy,
      dagdelenUsed: Math.round(usedDagdelen),
      dagdelenAvailable: totalDagdelenAvailable
    };
  }

  // Hulp functie voor het berekenen van maandelijkse capaciteit
  getMonthlyCapacity() {
    return {
      totalDagdelen: this.config.studios.length * 30 * 3, // 270 dagdelen totaal
      totalHours: this.config.studios.length * 30 * 3 * 4, // 1080 uur totaal
      dagdelenPerStudio: 90, // 30 dagen × 3 dagdelen
      hoursPerStudio: 360, // 90 dagdelen × 4 uur
      breakEvenDagdelen: Math.ceil(this.getTotalMonthlyCosts() / this.getAverageDayRate())
    };
  }

  private getAverageDayRate(): number {
    const totalDayRate = this.config.studios.reduce((sum, studio) => sum + studio.dayRate, 0);
    return totalDayRate / this.config.studios.length;
  }
}
