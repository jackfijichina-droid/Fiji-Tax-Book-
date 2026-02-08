
export enum EntryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum UserRole {
  BOSS = 'BOSS',
  STAFF = 'STAFF',
  ACCOUNTANT = 'ACCOUNTANT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Company {
  id: string;
  name: string;
  tin: string;
  address: string;
  phone: string;
  email: string;
  vatRegistered: boolean;
  vatRate: number;
}

export interface Customer {
  id: string;
  companyId: string;
  name: string;
  tin: string;
}

export interface Supplier {
  id: string;
  companyId: string;
  name: string;
  tin: string;
}

export interface TaxEntry {
  id: string;
  companyId: string;
  type: EntryType;
  counterpartyId: string; // References Customer or Supplier ID
  invoiceNo: string;
  date: string;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  category: string;
  description?: string;
}

export interface TaxPeriod {
  id: string;
  companyId: string;
  month: number; // 1-12
  year: number;
  status: 'OPEN' | 'FILED';
}

export interface VatSummary {
  id: string;
  periodId: string;
  outputVat: number;
  inputVat: number;
  vatPayable: number;
  generatedAt: string;
}

export interface DeadlineAlert {
  title: string;
  dueDate: string;
  status: 'urgent' | 'info';
}
