
export enum UserRole {
  DOCTOR = 'DOCTOR',
  RECEPTION = 'RECEPTION'
}

export type TreatmentType =
  | 'كشف'
  | 'حشو عادي'
  | 'حشو عصب'
  | 'خلع'
  | 'تنظيف'
  | 'تقويم'
  | 'مقدم تقويم'
  | 'قسط تقويم'
  | 'أجهزة تقويم'
  | 'لصق طربوش'
  | 'طربوش بورسلين'
  | 'طربوش زيركون'
  | 'تركيبات متحركة'
  | 'زراعة'
  | 'طقم كامل علوي'
  | 'طقم كامل سفلي'
  | 'تركيبة RPD'




export interface PaymentTransaction {
  id: string;
  amount: number;
  date: string;
}

export interface TreatmentRecord {
  id: string;
  type: TreatmentType;
  tooth: string;
  diagnosis: string;
  date: string;
  cost: number; // تكلفة الإجراء
  paid: number; // إجمالي ما تم دفعه (محسوب)
  payments: PaymentTransaction[]; // سجل الدفعات التفصيلي
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: 'ذكر' | 'أنثى';
  lastVisit: string;
  treatmentRecords: TreatmentRecord[];
  nextAppointment?: string;
  totalAmount: number; // إجمالي مبالغ كل الإجراءات
  paidAmount: number;  // إجمالي ما تم دفعه في كل الإجراءات
  selectedTeeth?: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  time: string;
  date: string;
  type: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Transaction {
  id: string;
  patientId: string;
  amount: number;
  date: string;
  description: string;
}
