export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created: string;
  isVerified: string;
  jwtToken?: string;
  loginMethod: string;
  externalPhotoLink?: string;
}

export interface Colors {
  colors: {
    currentTheme: string;
    logo: string;
    background: string;
    text: string;
    secondary: string;
  };
}

export interface Modal {
  modalOpen: boolean;
  currentModal: string;
}

export interface Theme {
  theme: Colors;
}

export interface StockHistory {
  name: string;
  ticker: string;
}

export interface StocksHistory {
  stocks: StockHistory[];
}

export interface AppState {
  auth: { user: User } | null;
  theme: Theme;
  modal: Modal;
  stockHistory: StocksHistory;
}

export interface ICompany {
  aboutComp: {
    Name: string;
    Price: number;
    Description: string;
    LogoUrl: string;
    StockId: string;
    FinancialStrength: number;
    ProfitabilityRank: number;
    ValuationRank: number;
    Sector: string;
    Ticker: string;
  };

  summary: {
    ForwardDividendYield: number;
    company: string;
    cash2debt: number;
    equity2asset: number;
    debt2equity: number;
    interest_coverage: number;
    fscore: number;
    zscore: number;
    mscore: number;
    oprt_margain: number;
    net_margain: number;
    roe: number;
    roa: number;
    ROC_JOEL: number;
    rvn_growth_3y: number;
    pe: number;
    forwardPE: number;
    pb: number;
    ps: number;
    peg: number;
    current_ratio: number;
    quick_ratio: number;

    description: {
      website: string;
    };
  };
}
