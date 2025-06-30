// lib/config.ts
export interface StudioConfig {
  id: string;
  name: string;
  size: number; // m²
  hourlyRate: number;
  dayRate: number;
  monthlyRate: number;
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
      dayRate: 40,
      monthlyRate: 160,
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
      dayRate: 32,
      monthlyRate: 128,
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
      // Aanname: 30 dagen * 12 uur per dag beschikbaar
      const maxHours = 30 * 12;
      return sum + (maxHours * studio.hourlyRate);
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
    return (monthlyProfit * this.config.partners.profitSplitPercentage) / 100;
  }

  // Scenario berekeningen uit je businessplan
  calculateScenario(occupancyRate: number, lockerOccupancy: number) {
    const totalHoursAvailable = this.config.studios.reduce((sum, studio) => {
      return sum + (30 * 12); // 30 dagen * 12 uur per dag
    }, 0);

    const usedHours = totalHoursAvailable * (occupancyRate / 100);
    
    let studioRevenue = 0;
    let remainingHours = usedHours;
    
    // Verdeel uren over studios (proportioneel naar tarief)
    for (const studio of this.config.studios) {
      const studioHours = Math.min(remainingHours, 30 * 12);
      studioRevenue += studioHours * studio.hourlyRate;
      remainingHours -= studioHours;
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
      lockerOccupancy
    };
  }
}
