
import React, { useState, useMemo, useEffect,useRef } from 'react';
import Layout from './Layout';
import PricingPage from "./PricingPage";
import { UserRole, Patient, Appointment, TreatmentType, TreatmentRecord, PaymentTransaction } from './types';
import { 
  Plus, Search, Clock, TrendingUp, DollarSign, Info, 
  Stethoscope, Users, Calendar, Edit3, Save, X, CalendarClock, ChevronRight, ChevronLeft, CalendarDays, MessageCircle, CreditCard, Trash2, History, Banknote, ExternalLink,Pencil,
  Wallet, CalendarRange, UserCircle, FileText, CheckCircle2, User, FileBarChart, CalendarDays as CalendarIcon, Filter, Activity, UserCog, Bell , 
} from 'lucide-react';
import { getClinicalInsight } from './geminiService';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useNotify } from "./NotificationProvider";
import { NotificationProvider } from "./NotificationProvider";
import { io, Socket } from "socket.io-client";
import Odontogram from "react-odontogram";
const socket: Socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
});
import DentalFrontalFDI from "./DentalFrontalFDI";


const API_URL = import.meta.env.VITE_API_URL;




const MOCK_PATIENTS: Patient[] = [
  { 
    id: '1', 
    name: 'ياسين محمد', 
    phone: '0123456789', 
    age: 28, 
    gender: 'ذكر',
    lastVisit: '2023-11-20', 
    treatmentRecords: [
      { 
        id: 'tr1', 
        type: 'حشو عصب', 
        tooth: 'UR4', 
        diagnosis: 'تسوس حاد', 
        date: '2023-11-20', 
        cost: 1500, 
        paid: 1000, 
        payments: [{ id: 'p1', amount: 1000, date: '2023-11-20' }] 
      }
    ],
    totalAmount: 1500, 
    paidAmount: 1000, 
    nextAppointment: '2025-05-28T10:00' 
  },
  { 
    id: '2', 
    name: 'سارة خالد', 
    phone: '0111222333', 
    age: 34, 
    gender: 'أنثى',
    lastVisit: '2023-11-22', 
    treatmentRecords: [
      { 
        id: 'tr2', 
        type: 'تنظيف', 
        tooth: 'LL1', 
        diagnosis: 'التهاب لثة', 
        date: '2023-11-22', 
        cost: 500, 
        paid: 500, 
        payments: [{ id: 'p2', amount: 500, date: '2023-11-22' }] 
      }
    ],
    totalAmount: 500, 
    paidAmount: 500 
  },
];

const REVENUE_DATA = [
  { name: 'السبت', value: 4000 },
  { name: 'الأحد', value: 3000 },
  { name: 'الاثنين', value: 2000 },
  { name: 'الثلاثاء', value: 2780 },
  { name: 'الأربعاء', value: 1890 },
  { name: 'الخميس', value: 2390 },
];

const TREATMENT_OPTIONS: TreatmentType[] = [
  'كشف',
  'حشو عادي',
  'حشو عصب',
  'خلع',
  'تنظيف',
  'تقويم',
  'لصق طربوش',
  'طربوش بورسلين',
  'طربوش زيركون',
  'تركيبات متحركة',
  'زراعة',
  'تركيبة RPD'
  
];



const COLORS = ['#0d9488', '#0ea5e9', '#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const ToothIcon: React.FC<{ selected: boolean; num: number }> = ({
  selected,
  num,
}) => {
  const stroke = selected ? "#0d9488" : "#1f2937";
  const fill = selected ? "#ccfbf1" : "#ffffff";

  // 1-2 قواطع
  if (num <= 2) {
    return (
      <svg viewBox="0 0 60 140" className="w-6 h-12">
        <path
          d="M30 10
             C20 10 18 25 18 45
             C18 70 22 100 30 130
             C38 100 42 70 42 45
             C42 25 40 10 30 10 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="3"
        />
      </svg>
    );
  }

  // 3-4-5 أنياب
  if (num <= 5) {
    return (
      <svg viewBox="0 0 60 150" className="w-6 h-14">
        <path
          d="M30 10
             C18 15 15 40 20 70
             C23 90 26 115 30 140
             C34 115 37 90 40 70
             C45 40 42 15 30 10 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="3"
        />
      </svg>
    );
  }

  // 6-7-8 ضروس
  return (
    <svg viewBox="0 0 120 110" className="w-10 h-12">
      <path
        d="M20 50
           C20 25 40 15 60 15
           C80 15 100 25 100 50
           C100 75 85 90 75 100
           C70 105 65 105 60 100
           C55 105 50 105 45 100
           C35 90 20 75 20 50 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="4"
      />
    </svg>
  );
};


const highlightStyle = `
@keyframes softPulseFade {
  0% {
    background-color: rgba(16, 185, 129, 0.18);
  }
  40% {
    background-color: rgba(16, 185, 129, 0.28);
  }
  70% {
    background-color: rgba(16, 185, 129, 0.18);
  }
  100% {
    background-color: transparent;
  }
}

.patient-soft-highlight {
  animation: softPulseFade 2.5s ease-in-out forwards;
}
`;




const DentalChartCurved: React.FC<{
  selected: string[];
  onSelect: (toothId: string) => void;
}> = ({ selected, onSelect }) => {
  const upperRight = [8, 7, 6, 5, 4, 3, 2, 1];
  const upperLeft  = [1, 2, 3, 4, 5, 6, 7, 8];
  const lowerRight = [8, 7, 6, 5, 4, 3, 2, 1];
  const lowerLeft  = [1, 2, 3, 4, 5, 6, 7, 8];

 const renderTooth = (quad: string, num: number) => {
  const id = `${quad}${num}`;
  const isSelected = selected.includes(id);

return (
  <button
    key={id}
    type="button"
    onClick={() => onSelect(id)}
    className={`
  relative w-16 h-20 rounded-xl flex flex-col items-center justify-center
  border transition-all duration-200
  ${
    isSelected
      ? "bg-teal-50 border-teal-600 scale-105 shadow-md"
      : "bg-white border-gray-200 hover:bg-gray-50"
  }
`}
  >
    {/* هنا التعديل */}
    <ToothIcon selected={isSelected} num={num} />

    <span
      className={`text-[10px] font-semibold mt-1 ${
        isSelected ? "text-teal-700" : "text-gray-600"
      }`}
    >
      {num}
    </span>
  </button>
);
};


  const Section = ({
    title,
    quad,
    teeth,
  }: {
    title: string;
    quad: string;
    teeth: number[];
  }) => (
    <div className="space-y-2">
      <div className="text-xs font-bold text-gray-500 text-center">
        {title}
      </div>
      <div className="flex gap-1 justify-center">
        {teeth.map(num => renderTooth(quad, num))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 bg-white p-4 rounded-xl border border-gray-100">
      {/* الفك العلوي */}
      <div className="grid grid-cols-2 gap-6">
        <Section
          title="الفك العلوي – يمين"
          quad="UR"
          teeth={upperRight}
        />
        <Section
          title="الفك العلوي – يسار"
          quad="UL"
          teeth={upperLeft}
        />
      </div>

      <hr className="border-gray-200" />

      {/* الفك السفلي */}
      <div className="grid grid-cols-2 gap-6">
        <Section
          title="الفك السفلي – يمين"
          quad="LR"
          teeth={lowerRight}
        />
        <Section
          title="الفك السفلي – يسار"
          quad="LL"
          teeth={lowerLeft}
        />
      </div>
    </div>
  );
};



const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingTreatment, setEditingTreatment] = useState<TreatmentRecord | null>(null);
  const [highlightedPatients, setHighlightedPatients] = useState<string[]>([]);
const [exportType, setExportType] = useState("");
const [showExportMenu, setShowExportMenu] = useState(false);

const [copyDone, setCopyDone] = useState(false);

const [patients, setPatients] = useState<Patient[]>([]);

const [showNextAppointment, setShowNextAppointment] = useState(false);
const [nextVisit, setNextVisit] = useState<{ date: string; time: string }>({
  date: "",
  time: "",
});


const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
const lastUpdatedPatientId = useRef<string | null>(null);


const [selectedTeeth, setSelected] = useState<string[]>([]);
const notify = useNotify();
const [currentPage, setCurrentPage] = useState(1);
const PAGE_SIZE = 15;
const [expenses, setExpenses] = useState<any[]>([]);

const todayLocal = new Date().toLocaleDateString("en-CA");

const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const [reportStart, setReportStart] = useState(
  thirtyDaysAgo.toISOString().split("T")[0]
);

const [reportEnd, setReportEnd] = useState(todayLocal);

const filteredPayments = useMemo(() => {
  return patients.flatMap(p =>
    p.treatmentRecords.flatMap(r =>
      (r.payments || []).filter(pay =>
        pay.date >= reportStart &&
        pay.date <= reportEnd
      )
    )
  );
}, [patients, reportStart, reportEnd]);

const filteredExpenses = useMemo(() => {
  return expenses.filter(exp =>
    exp.date >= reportStart &&
    exp.date <= reportEnd
  );
}, [expenses, reportStart, reportEnd]);

const totalCollected = useMemo(() => {
  return patients
    .flatMap(p =>
      p.treatmentRecords.flatMap(r =>
        (r.payments || [])
      )
    )
    .filter(pay =>
      pay.date >= reportStart &&
      pay.date <= reportEnd
    )
    .reduce((sum, pay) => sum + pay.amount, 0);
}, [patients, reportStart, reportEnd]);


const totalExpenses = useMemo(() => {
  return expenses
    .filter(exp =>
      exp.date >= reportStart &&
      exp.date <= reportEnd
    )
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

}, [expenses, reportStart, reportEnd]);

const handleToothClick = (toothId: string) => {
  setSelected(prev =>
    prev.includes(toothId)
      ? prev.filter(t => t !== toothId)
      : [...prev, toothId]
  );
};

const netProfit = totalCollected - totalExpenses;

const [showExpenseModal, setShowExpenseModal] = useState(false);

const [newExpense, setNewExpense] = useState({
  category: "",
  sub_category: "",
  amount: "",
  date: "",
  time: "",
  note: ""
});

const [pricingMode, setPricingMode] = useState<'simple' | 'advanced'>('simple');
const [materials, setMaterials] = useState([
  { id: Date.now().toString(), name: '', cost: 0 }
]);

const [isMaterialsOpen, setIsMaterialsOpen] = useState(true);




const loadPatients = async () => {
  const res = await fetch(`${API_URL}/patients`);
  const patientsData = await res.json();

  const withTreatments = await Promise.all(
    patientsData.map(async (p: any) => {
      // 1️⃣ هات كل الإجراءات الطبية
      const trRes = await fetch(`${API_URL}/patients/${p.id}/treatments`);
      const tr = await trRes.json();

      // 2️⃣ لكل إجراء → هات الدفعات
      const treatmentsWithPayments = await Promise.all(
        tr.map(async (r: any) => {
          const payRes = await fetch(
            `${API_URL}/treatments/${r.id}/payments`
          );
          const payments = await payRes.json();
          

          return {
            id: r.id?.toString(),
            type: r.type,
            tooth: r.tooth,
            diagnosis: r.diagnosis,
            date: r.date,
            cost: Number(r.cost) || 0,
            paid: Number(r.paid) || 0,
            payments,
          };
        })
      );

      // 3️⃣ حساب الإجماليات
      const totalAmount = treatmentsWithPayments.reduce(
        (sum: number, r: any) => sum + r.cost,
        0
      );

      const paidAmount = treatmentsWithPayments.reduce(
        (sum: number, r: any) => sum + r.paid,
        0
      );

      return {
        id: p.id?.toString(),
        name: p.name,
        phone: p.phone,
        age: p.age ?? 0,
        gender: p.gender ?? "ذكر",

        // ✅ السطر المهم جدًا
        nextAppointment: p.nextAppointment || "",

        treatmentRecords: treatmentsWithPayments,
        totalAmount,
        paidAmount,
        lastVisit: treatmentsWithPayments[0]?.date ?? "",
      };
    })
  );

setPatients(withTreatments);

// ⭐ هايلايت المريض اللي اتعدل بس
if (lastUpdatedPatientId.current) {
  setHighlightedPatients([lastUpdatedPatientId.current]);

  setTimeout(() => {
    setHighlightedPatients([]);
    lastUpdatedPatientId.current = null;
  }, 2500);
}

};





useEffect(() => {
  // تحميل المرضى
  loadPatients();
  

  // تحميل المصاريف للشهر الحالي
  const now = new Date();
const currentMonth = `${now.getFullYear()}-${String(
  now.getMonth() + 1
).padStart(2, "0")}`;


const loadExpenses = () => {
  fetch(`${API_URL}/expenses`)
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        setExpenses(data.data);   // ✅ ده الصح
      } else {
        setExpenses([]);          // احتياطي
      }
    })
    .catch(err => {
      console.error("Expenses load error:", err);
      setExpenses([]);
    });
};

  loadExpenses();

  socket.on("connect", () => {
    console.log("🟢 socket connected:", socket.id);
  });

  // 👥 تحديث المرضى
  socket.on("patients:changed", () => {
    console.log("👥 patients changed → reload");
    loadPatients();
  });

  // 🦷 إجراءات طبية
  socket.on("treatments:changed", () => {
    console.log("🦷 treatments changed");
    loadPatients();
  });

  // 💰 دفعات
  socket.on("payments:changed", () => {
    console.log("💰 payments changed");
    loadPatients();
  });

  // 📅 مواعيد
  socket.on("appointments:changed", () => {
    console.log("📅 appointments changed");
    loadPatients();
  });

  // 🧾 مصاريف
  socket.on("expenses:changed", () => {
    console.log("🧾 expenses changed → reload");
    loadExpenses();
  });

  return () => {
    socket.off("patients:changed");
    socket.off("treatments:changed");
    socket.off("payments:changed");
    socket.off("appointments:changed");
    socket.off("expenses:changed");
  };
}, []);




const addPatient = async (patient: {
  name: string;
  phone: string;
  age?: number;
  gender?: "ذكر" | "أنثى";
}) => {
  try {
    await fetch(`${API_URL}/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        name: patient.name,
        phone: patient.phone,
        age: patient.age ?? 0,
        gender: patient.gender ?? "ذكر",
      }),
    });

    // ✅ إعادة تحميل الداتا من المصدر الحقيقي
    await loadPatients();

  } catch (err) {
    console.error("خطأ في إضافة المريض", err);
  }
};


  const [searchQuery, setSearchQuery] = useState('');
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isEditPatientInfoModalOpen, setIsEditPatientInfoModalOpen] = useState(false);
  const [isEditTreatmentModalOpen, setIsEditTreatmentModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({ gender: 'ذكر' });
  const [profileTab, setProfileTab] = useState<"treatments" | "payments">("treatments");

  

 const [tempPayments, setTempPayments] = useState<
  Record<string, { amount: number; date: string }>>({});

  const [newProcedure, setNewProcedure] = useState<Partial<TreatmentRecord>>({ 
    type: '', tooth: '', diagnosis: '', date: new Date().toISOString().split('T')[0], cost: 0, paid: 0, payments: []});

  const [nextDate, setNextDate] = useState('');
  const [nextTime, setNextTime] = useState('');

  const [clinicalInsight, setClinicalInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());

  const getArcPosition = (
  index: number,
  total: number,
  radius: number,
  centerX: number,
  centerY: number,
  startAngle: number,
  endAngle: number
) => {
  const angle =
    startAngle +
    (index / (total - 1)) * (endAngle - startAngle);

  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
};



const CurvedJaw = ({
  teeth,
  quadrantPrefix,
  selected,
  onSelect,
  isUpper,
}: {
  teeth: number[];
  quadrantPrefix: string;
  selected: string[];
  onSelect: (id: string) => void;
  isUpper: boolean;
}) => {
  const radius = 0;
  const centerX = 0;
  const centerY = isUpper ? 0 : 0;

  return (
    <svg width={300} height={160} className="mx-auto">
      {teeth.map((num, i) => {
        const id = `${quadrantPrefix}${num}`;
        const pos = getArcPosition(
          i,
          teeth.length,
          radius,
          centerX,
          centerY,
          isUpper ? Math.PI : 0,
          isUpper ? 0 : Math.PI
        );

        const isSelected = selected.includes(id);

        return (
          <g
            key={id}
            transform={`translate(${pos.x}, ${pos.y})`}
            onClick={() => onSelect(id)}
            className="cursor-pointer"
          >
            <circle
              r="14"
              className={
                isSelected
                  ? "fill-teal-600"
                  : "fill-gray-100 hover:fill-teal-100"
              }
            />
            <text
              y="4"
              textAnchor="middle"
              className={`text-[9px] font-bold ${
                isSelected ? "fill-white" : "fill-gray-600"
              }`}
            >
              {num}
            </text>
          </g>
        );
      })}
    </svg>
  );
};


const upcomingAppointments = useMemo(() => {
  return patients
    .filter(p => {
      if (!p.nextAppointment) return false;

      const appointmentDateTime = new Date(p.nextAppointment);
      const now = new Date();

      return appointmentDateTime > now;
    })
    .map(p => {
      const [d, t] = p.nextAppointment!.split('T');
      return {
        id: p.id,
        patientName: p.name,
        date: d,
        time: t,
        type: p.treatmentRecords[p.treatmentRecords.length - 1]?.type || 'مراجعة'
      };
    })
    .sort((a, b) => new Date(a.date + "T" + a.time).getTime() - new Date(b.date + "T" + b.time).getTime())
    .slice(0, 5);
}, [patients]);

const reportData = useMemo(() => {
  const counts: Record<string, number> = {};
  TREATMENT_OPTIONS.forEach(opt => { if (opt) counts[opt] = 0; });

  patients.forEach(patient => {
    patient.treatmentRecords.forEach(record => {
      if (
        record.date >= reportStart &&
        record.date <= reportEnd
      ) {

        const cleanType = record.type?.trim();

        if (cleanType && counts[cleanType] !== undefined) {

          // حساب عدد الأسنان
          const teethCount = record.tooth
            ? record.tooth
                .split(",")
                .filter(t => t.trim() !== "").length
            : 1;

          counts[cleanType] += teethCount;
        }

      }
    });
  });

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

}, [patients, reportStart, reportEnd]);


  const totalCasesInPeriod = useMemo(() => {
    return reportData.reduce((sum, item) => sum + item.value, 0);
  }, [reportData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setRole(UserRole.DOCTOR);
      setIsLoggedIn(true);
    } else if (username === 'reception' && password === 'reception') {
      setRole(UserRole.RECEPTION);
      setIsLoggedIn(true);
    } else {
      alert('خطأ في اسم المستخدم أو كلمة المرور');
    }
    
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setUsername('');
    setPassword('');
  };

const handleAddPatient = async () => {
  if (!newPatient.name || !newPatient.phone) return;

  try {
    // 1️⃣ إضافة المريض
    await fetch(`${API_URL}/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newPatient.name,
        phone: newPatient.phone,
        age: Number(newPatient.age) || 0,
        gender: newPatient.gender || "ذكر",
      }),
    });

    const patientName = newPatient.name;

    // 🔔 Notification للسيرفر (Teal Badge)
    await fetch(`${API_URL}/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `👩‍💼 تم تسجيل مريض جديد 
          <span style="
            background:#ccfbf1;
            color:#0f766e;
            padding:3px 12px;
            border-radius:999px;
            font-weight:700;
            display:inline-block;
            margin-right:6px;
          ">
            ${patientName}
          </span>`,
        role: "all",
      }),
    });

    // 🔔 Toast محلي
    notify(`👩‍💼 تم إضافة المريض ${patientName}`);

    // ✅ إعادة تحميل
    await loadPatients();

    // 🧹 تنظيف
    setIsAddPatientModalOpen(false);
    setNewPatient({ name: "", phone: "", age: "", gender: "ذكر" });

  } catch (err) {
    console.error(err);
    alert("حصل خطأ أثناء إضافة المريض");
  }
};




const handleDeleteProcedure = async (treatmentId: string) => {
  if (!editingPatient) return;

  const patientName = editingPatient.name;

  // 1️⃣ حذف من الداتا بيز
  await fetch(
    `${API_URL}/patients/${editingPatient.id}/treatments/${treatmentId}`,
    { method: "DELETE" }
  );

  // 🔔 Notification للسيرفر (Badge Style)
  await fetch(`${API_URL}/notifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `🗑️ تم حذف إجراء للمريض 
        <span style="
          background:#ccfbf1;
          color:#0f766e;
          padding:3px 12px;
          border-radius:999px;
          font-weight:700;
          display:inline-block;
          margin-right:6px;
        ">
          ${patientName}
        </span>`,
      role: "all",
    }),
  });

  // 🔔 Toast محلي
  notify(`🗑️ تم حذف إجراء للمريض ${patientName}`);

  // 2️⃣ تحديث الواجهة فورًا
  setEditingPatient(prev =>
    prev
      ? {
          ...prev,
          treatmentRecords: prev.treatmentRecords.filter(
            r => r.id !== treatmentId
          ),
        }
      : prev
  );

  // 3️⃣ لو كنت بتعدل نفس الإجراء → اخرج من وضع التعديل
  if (editingTreatment?.id === treatmentId) {
    setEditingTreatment(null);
    setNewProcedure({
      type: "",
      tooth: "",
      diagnosis: "",
      date: new Date().toISOString().split("T")[0],
      cost: 0,
      paid: 0,
      payments: [],
    });
  }

  // 4️⃣ مزامنة نهائية
  await loadPatients();
};



const handleDeletePatient = async (id: string) => {
  if (!window.confirm("هل أنت متأكد من حذف المريض؟")) return;

  try {
    // 🔍 نجيب اسم المريض قبل الحذف
    const patientToDelete = patients.find(p => p.id === id);
    const patientName = patientToDelete?.name || "";

    // 1️⃣ حذف من الداتا بيز
    await fetch(`${API_URL}/patients/${id}`, {
      method: "DELETE",
    });

    // 🔔 Notification لكل الشاشات (Badge Style)
    await fetch(`${API_URL}/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `🗑️ تم حذف المريض 
          <span style="
            background:#ccfbf1;
            color:#0f766e;
            padding:3px 12px;
            border-radius:999px;
            font-weight:700;
            display:inline-block;
            margin-right:6px;
          ">
            ${patientName}
          </span>`,
        role: "all",
      }),
    });

    // 🔔 Toast محلي
    notify(`🗑️ تم حذف المريض ${patientName}`);

    // ✅ تحديث المصدر الوحيد للداتا
    await loadPatients();

  } catch (err) {
    console.error("خطأ في حذف المريض", err);
  }
};



const handleUpdatePatientInfo = async () => {
  if (!editingPatient?.id) return;

  const patientName = editingPatient.name;

  await fetch(`${API_URL}/patients/${editingPatient.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: editingPatient.name,
      phone: editingPatient.phone,
      age: editingPatient.age,
      gender: editingPatient.gender,
    }),
  });

  // 🔔 Notification للسيرفر (Badge Style)
  await fetch(`${API_URL}/notifications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `✏️ تم تحديث بيانات المريض 
        <span style="
          background:#ccfbf1;
          color:#0f766e;
          padding:3px 12px;
          border-radius:999px;
          font-weight:700;
          display:inline-block;
          margin-right:6px;
        ">
          ${patientName}
        </span>`,
      role: "all",
    }),
  });

  // إعادة تحميل المرضى
  const res = await fetch(`${API_URL}/patients`);
  const data = await res.json();

  setPatients(
    data.map((p: any) => ({
      id: p.id.toString(),
      name: p.name,
      phone: p.phone,
      age: p.age ?? 0,
      gender: p.gender ?? "ذكر",
      treatmentRecords: [],
      totalAmount: 0,
      paidAmount: 0,
      lastVisit: new Date().toISOString().split("T")[0],
    }))
  );

  setIsEditPatientInfoModalOpen(false);

  // 🔔 Toast محلي
  notify(`✏️ تم تحديث بيانات المريض ${patientName}`);
};



  const calculatePatientTotals = (records: TreatmentRecord[]) => {
    const total = records.reduce((sum, r) => sum + (r.cost || 0), 0);
    const paid = records.reduce((sum, r) => sum + (r.payments?.reduce((s, p) => s + p.amount, 0) || 0), 0);
    return { total, paid };
  };

const handleSaveAllChanges = async () => {
  if (!editingPatient) return;

  try {
    // 🟢 جهزي القيمة مرة واحدة
    const appointmentValue =
      nextVisit?.date
        ? nextVisit.time
          ? `${nextVisit.date}T${nextVisit.time}`
          : `${nextVisit.date}T00:00`
        : "";

    // 🟢 لو في موعد → ابعتيه للسيرفر
    if (appointmentValue) {
      await fetch(`${API_URL}/patients/${editingPatient.id}/appointment`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nextAppointment: appointmentValue,
        }),
      });

      // ✅ تحديث فوري في سجل الإجراء (UI)
      setEditingPatient(prev =>
        prev
          ? {
              ...prev,
              nextAppointment: appointmentValue,
            }
          : prev
      );
    }

    // 🟢 إعادة تحميل الداتا الحقيقية (realtime + باقي الشاشات)
    await loadPatients();

    // 🧹 تنظيف الحالات
    setNextVisit(null);
    setIsEditTreatmentModalOpen(false);

  } catch (error) {
    console.error("Error saving changes:", error);
    alert("حدث خطأ أثناء حفظ التعديلات");
  }
};





const handleAddNewProcedure = async () => {
  if (!editingPatient || !newProcedure.type) return;

  const patientName = editingPatient.name;
  const procedureType = newProcedure.type;
const toothNumber =
  newProcedure.tooth && newProcedure.tooth !== "-"
    ? newProcedure.tooth
        .split(",")
        .map(t => {
          const clean = t.trim();
          const map: any = { "1":"UR", "2":"UL", "3":"LL", "4":"LR" };
          return clean.length === 2
            ? `${map[clean[0]]}${clean[1]}`
            : clean;
        })
        .join(", ")
    : "-";

  try {
    const tempTreatment = {
      id: `temp-${Date.now()}`,
      type: newProcedure.type!,
      tooth: newProcedure.tooth || "-",
      diagnosis: newProcedure.diagnosis || "",
      date: new Date().toISOString().split("T")[0],
      cost: Number(newProcedure.cost) || 0,
      paid: Number(newProcedure.paid) || 0,
      payments: [],
    };

    // تحديث فوري في المودال
    setEditingPatient(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        treatmentRecords: [tempTreatment, ...prev.treatmentRecords],
      };
    });

    // إرسال للسيرفر
    await fetch(`${API_URL}/patients/${editingPatient.id}/treatments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: newProcedure.type,
        tooth: newProcedure.tooth || "-",
        diagnosis: newProcedure.diagnosis || "",
        date: tempTreatment.date,
        cost: tempTreatment.cost,
        paid: tempTreatment.paid,
      }),
    });

    // 🔔 Notification للسيرفر (Badge Style)
    await fetch(`${API_URL}/notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `
          ➕ تم إضافة إجراء 
          <span style="
            background:#fef3c7;
            color:#92400e;
            padding:3px 10px;
            border-radius:999px;
            font-weight:700;
            display:inline-block;
            margin:0 4px;
          ">
            ${procedureType}
          </span>
          (سن 
          <span style="
            background:#fee2e2;
            color:#991b1b;
            padding:3px 8px;
            border-radius:999px;
            font-weight:700;
            display:inline-block;
            margin:0 4px;
          ">
            ${toothNumber}
          </span>)
          للمريض 
          <span style="
            background:#ccfbf1;
            color:#0f766e;
            padding:3px 12px;
            border-radius:999px;
            font-weight:700;
            display:inline-block;
            margin-right:6px;
          ">
            ${patientName}
          </span>
        `,
        role: "all",
      }),
    });

    // 🔔 Toast محلي
    notify(`➕ تم إضافة إجراء ${procedureType} (سن ${toothNumber}) للمريض ${patientName}`);

    // تنظيف
    setNewProcedure({
      type: "",
      tooth: "",
      diagnosis: "",
      date: new Date().toISOString().split("T")[0],
      cost: 0,
      paid: 0,
      payments: [],
    });

    await loadPatients();

  } catch (err) {
    console.error("خطأ في إضافة الإجراء", err);
    alert("حصل خطأ أثناء حفظ الإجراء");
  }
};



const handleAddInstallment = async (recordIndex: number) => {
  if (!editingPatient) return;

  const record = editingPatient.treatmentRecords[recordIndex];
  if (!record) return;

  const payment = tempPayments[record.id];
  if (!payment || payment.amount <= 0) return;

  // 🧮 حساب المدفوع والمتبقي
  const totalPaid =
    record.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

  const remaining = record.cost - totalPaid;

  // ⛔ حماية محاسبية
  if (remaining <= 0 || payment.amount > remaining) {
    alert("تم اكتمال حساب هذا الإجراء ولا يمكن إضافة تحصيل آخر");
    return;
  }

  try {
    // 1️⃣ دفعة مؤقتة (UI only)
    const newTransaction: PaymentTransaction = {
      id: `temp-${Date.now()}`,
      amount: payment.amount,
      date: payment.date,
    };

    // 2️⃣ تحديث فوري في المودال
    setEditingPatient(prev => {
      if (!prev) return prev;

      const updatedRecords = prev.treatmentRecords.map((r, idx) =>
        idx === recordIndex
          ? {
              ...r,
              payments: [...(r.payments || []), newTransaction],
              paid: [...(r.payments || []), newTransaction].reduce(
                (sum, p) => sum + p.amount,
                0
              ),
            }
          : r
      );

      return { ...prev, treatmentRecords: updatedRecords };
    });

    // 3️⃣ إرسال الدفعة للسيرفر
    await fetch(`${API_URL}/treatments/${record.id}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: payment.amount,
        date: payment.date,
      }),
    });

    // 🔔 Notification للسيرفر (لكل الشاشات)
    
await fetch(`${API_URL}/notifications`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: `💰 تم تسجيل دفعة بقيمة 
      <span style="color:#a10e90;font-weight:700">
        ${payment.amount} ج.م
      </span>
      للمريض 
      <span style="color:#a10e90;font-weight:700">
        ${editingPatient.name}
      </span>`,
    role: "all",
  }),
});


    // 🔔 Notification محلي
    notify("💰 تم تسجيل دفعة التحصيل بنجاح");

    // 4️⃣ مسح المدخل للإجراء ده بس
    setTempPayments(prev => {
      const copy = { ...prev };
      delete copy[record.id];
      return copy;
    });

    // 5️⃣ مزامنة نهائية (مصدر واحد للداتا)
    await loadPatients();

  } catch (err) {
    console.error("خطأ في تسجيل دفعة التحصيل", err);
    alert("حدث خطأ أثناء تسجيل الدفعة");
  }
};



const handleBulkDelete = async () => {
  if (
    !window.confirm(
      `هل أنت متأكد من حذف ${selectedPatients.length} مريض؟`
    )
  )
    return;

  try {
    await Promise.all(
      selectedPatients.map(id =>
        fetch(`${API_URL}/patients/${id}`, {
          method: "DELETE",
        })
      )
    );

    // تحديث فوري في الواجهة
    setPatients(prev =>
      prev.filter(p => !selectedPatients.includes(p.id))
    );

    // تفريغ التحديد
    setSelectedPatients([]);
  } catch (err) {
    console.error(err);
    alert("حدث خطأ أثناء الحذف");
  }
};


  const handleUpdatePayment = () => {
    if (!editingPatient) return;
    const { total, paid } = calculatePatientTotals(editingPatient.treatmentRecords);
    const updatedPatient = {
      ...editingPatient,
      totalAmount: total,
      paidAmount: paid
    };
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    setIsPaymentModalOpen(false);
    setEditingPatient(null);
  };

  const fetchInsight = async (p: Patient) => {
    setLoadingInsight(true);
    const lastRecord = p.treatmentRecords[p.treatmentRecords.length - 1];
    const insight = await getClinicalInsight(lastRecord?.diagnosis || 'لا يوجد', lastRecord?.type || 'لا يوجد');
    setClinicalInsight(insight);
    setLoadingInsight(false);
  };

  const changeMonth = (offset: number) => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const monthLabel = viewDate.toLocaleString('ar-EG', { month: 'long', year: 'numeric' });

  const getWhatsAppLink = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const formatted = cleaned.startsWith('0') ? '2' + cleaned : cleaned;
    return `https://wa.me/${formatted}`;
  };
  
 const filteredPatients = patients.filter(p => {
  const query = searchQuery.toLowerCase().trim();

  if (!query) return true;

  // البحث في الاسم
  const nameMatch = query
    .split(" ")
    .every(word => p.name?.toLowerCase().includes(word));

  // البحث في الهاتف
  const phoneMatch = p.phone?.includes(query);

  // البحث في كل الإجراءات الطبية للمريض
  const treatmentMatch = p.treatmentRecords?.some(record =>
    record.type?.toLowerCase().includes(query)
  );

  return nameMatch || phoneMatch || treatmentMatch;
});



  const totalPages = Math.ceil(filteredPatients.length / PAGE_SIZE);

const paginatedPatients = filteredPatients.slice(
  (currentPage - 1) * PAGE_SIZE,
  currentPage * PAGE_SIZE
);

  
  

  const weeklyRevenue = useMemo(() => {
  const days = ["السبت","الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة"];
  const map: Record<string, number> = {};
  days.forEach(d => (map[d] = 0));

  patients.forEach(p => {
    p.treatmentRecords.forEach(r => {
      r.payments?.forEach(pay => {
        const day = new Date(pay.date).toLocaleDateString("ar-EG", {
          weekday: "long",
        });
        if (map[day] !== undefined) {
          map[day] += pay.amount;
        }
      });
    });
  });

  return days.map(d => ({ name: d, value: map[d] }));
}, [patients]);


  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-600 to-teal-800 p-4">
        <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl w-full max-w-md">
          <div className="text-center mb-8 md:mb-10">
            <div className="bg-teal-50 w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm">
              <Stethoscope className="text-teal-600" size={32} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">دينتا كلاود</h1>
            <p className="text-gray-500 text-xs md:text-sm">إدارة العيادة أصبحت أسهل</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4 md:space-y-5">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 border border-gray-100 bg-gray-50 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 text-sm" placeholder="اسم المستخدم" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 md:px-5 py-3 md:py-4 border border-gray-100 bg-gray-50 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-teal-500 text-sm" placeholder="كلمة المرور" required />
            <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 md:py-4 rounded-xl md:rounded-2xl shadow-lg transition-all transform active:scale-95 text-sm">دخول النظام</button>
          </form>
        </div>
      </div>
    );
  }

  


  return (
    <NotificationProvider>
        <style>{highlightStyle}</style>
    <Layout role={role!} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      <div className="w-full px-4 lg:px-8 space-y-6 md:space-y-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3 md:gap-4">
                <div className="bg-blue-50 p-3 md:p-4 rounded-xl md:rounded-2xl text-blue-600 shrink-0"><Users size={20} /></div>
                <div className="min-w-0"><p className="text-gray-400 text-[10px] md:text-xs font-bold mb-1 uppercase truncate">المرضى</p><h4 className="text-lg md:text-2xl font-bold">{patients.length}</h4></div>
              </div>
              <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3 md:gap-4">
  <div className="bg-teal-50 p-3 md:p-4 rounded-xl md:rounded-2xl text-teal-600 shrink-0">
    <Calendar size={20} />
  </div>

  <div className="min-w-0">
    <p className="text-gray-400 text-[10px] md:text-xs font-bold mb-1 uppercase truncate">
      مواعيد اليوم
    </p>
    <h4 className="text-lg md:text-2xl font-bold">
      {patients.filter(p =>
        p.nextAppointment?.startsWith(todayLocal)
      ).length}
    </h4>
  </div>
</div>

              <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3 md:gap-4">
                <div className="bg-yellow-50 p-3 md:p-4 rounded-xl md:rounded-2xl text-yellow-600 shrink-0"><Clock size={20} /></div>
                <div className="min-w-0"><p className="text-gray-400 text-[10px] md:text-xs font-bold mb-1 uppercase truncate">الانتظار</p><h4 className="text-lg md:text-2xl font-bold">
  {upcomingAppointments.length}
</h4>
</div>
              </div>
              {role === UserRole.DOCTOR && (
                <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3 md:gap-4">
                  <div className="bg-green-50 p-3 md:p-4 rounded-xl md:rounded-2xl text-green-600 shrink-0"><DollarSign size={20} /></div>
                  <div className="min-w-0"><p className="text-gray-400 text-[10px] md:text-xs font-bold mb-1 uppercase truncate">الدخل الكلي</p><h4 className="text-lg md:text-2xl font-bold">{patients.reduce((sum, p) => sum + p.paidAmount, 0)}</h4></div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              {role === UserRole.DOCTOR && (
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6 md:mb-8">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800">إحصائيات الأداء الأسبوعي</h3>
                    <TrendingUp size={18} className="text-teal-600" />
                  </div>
                  <div className="h-48 md:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyRevenue}>
<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" /><XAxis dataKey="name" tick={{fontSize: 10}} /><YAxis tick={{fontSize: 10}} /><Tooltip /><Bar dataKey="value" fill="#0d9488" radius={[4, 4, 0, 0]} /></BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              <div className={`bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm ${role === UserRole.RECEPTION ? 'lg:col-span-3' : ''}`}>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2"><CalendarClock className="text-teal-600" size={20} /> المواعيد القادمة</h3>
                <div className="space-y-3 md:space-y-4">
                  {upcomingAppointments.length > 0 ? upcomingAppointments.map(app => (
                    <div
  key={app.id}
  onClick={() => {
    const patient = patients.find(p => p.id === app.id);
    if (!patient) return;
    setEditingPatient({ ...patient });
    setIsEditTreatmentModalOpen(true);
  }}
  className="flex items-center justify-between cursor-pointer ..."
>

                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg md:rounded-xl flex items-center justify-center font-bold text-teal-700 shadow-sm border border-gray-100 text-xs md:text-sm">{app.time.slice(0, 5)}</div>
                        <div className="min-w-0"><p className="font-bold text-gray-800 text-sm md:text-base truncate">{app.patientName}</p><p className="text-[10px] md:text-xs text-gray-400">{app.date}</p></div>
                      </div>
                      <ChevronLeft size={14} className="text-gray-300 shrink-0" />
                    </div>
                  )) : <p className="text-center text-gray-400 py-6 md:py-10 text-sm">لا يوجد مواعيد قادمة</p>}
                </div>
              </div>
            </div>
          </div>
        )}

          {activeTab === 'patients' && (
            <div className="animate-in fade-in duration-500">

              {/* ===== HEADER ===== */}
              <div className="flex items-center justify-between mb-6 md:mb-8">

                {/* 🔵 Search (يمين) */}
                <div className="relative w-full sm:max-w-md">
                  <Search
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="ابحث بالاسم أو رقم الهاتف..."
                    className="w-full pr-11 pl-4 py-3 md:py-4 border border-gray-100 bg-white rounded-xl md:rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-teal-500 transition-all text-sm"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                {/* 🔴 Buttons (شمال) */}
                <div className="flex items-center gap-4 flex-wrap">

                  {/* زر إضافة */}
                  <button
                    onClick={() => setIsAddPatientModalOpen(true)}
                    className="flex items-center justify-center gap-2
                              bg-teal-600 text-white px-6 md:px-8 py-3 md:py-4
                              rounded-xl md:rounded-2xl font-bold
                              shadow-lg shadow-teal-100
                              transition-all hover:bg-teal-700 hover:shadow-xl
                              transform active:scale-95 text-sm"
                  >
                    <Plus size={18} />
                    <span>إضافة مريض</span>
                  </button>

                  {/* زر استخراج */}
                  <div className="relative">
                    <button
                      onClick={() => setShowExportMenu(prev => !prev)}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg"
                    >
                      استخراج الأرقام
                    </button>

                    {showExportMenu && (
                      <div className="absolute mt-2 bg-white border rounded-xl shadow-lg p-4 w-64 z-50">
                        <select
                          value={exportType}
                          onChange={(e) => setExportType(e.target.value)}
                          className="w-full border px-3 py-2 rounded-lg text-sm mb-3"
                        >
                          <option value="">اختر نوع الاستخراج</option>
                          <option value="all">كل المرضى</option>
                          {TREATMENT_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>

                        <div className="flex gap-2">

                          {/* نسخ */}
                          <button
                            onClick={() => {
                              if (!exportType) {
                                notify("اختار نوع الاستخراج الأول");
                                return;
                              }

                              const filtered =
                                exportType === "all"
                                  ? patients
                                  : patients.filter(p =>
                                      p.treatmentRecords.some(
                                        r => (r.type || "").trim() === exportType
                                      )
                                    );

                              if (filtered.length === 0) {
                                notify("مفيش بيانات مطابقة");
                                return;
                              }

                              const text = filtered
                                .map(p => `${p.name} - ${p.phone}`)
                                .join("\n");

                              const textarea = document.createElement("textarea");
                              textarea.value = text;
                              textarea.style.position = "fixed";
                              textarea.style.left = "-9999px";
                              document.body.appendChild(textarea);
                              textarea.focus();
                              textarea.select();

                              try {
                                document.execCommand("copy");
                                notify(`✅ تم نسخ ${filtered.length} رقم`);
                                setShowExportMenu(false);
                              } catch {
                                notify("❌ حصل خطأ أثناء النسخ");
                              }

                              document.body.removeChild(textarea);
                            }}
                            className="bg-teal-600 text-white px-3 py-2 rounded-lg text-xs font-bold"
                          >
                            نسخ
                          </button>

                          {/* Excel */}
                          <button
                            onClick={() => {
                              if (!exportType) {
                                notify("⚠️ اختار نوع الاستخراج الأول");
                                return;
                              }

                              const filtered =
                                exportType === "all"
                                  ? patients
                                  : patients.filter(p =>
                                      p.treatmentRecords.some(
                                        r => (r.type || "").trim() === exportType
                                      )
                                    );

                              if (filtered.length === 0) {
                                notify("⚠️ مفيش بيانات مطابقة");
                                return;
                              }

                              const rows = filtered.map(p => `${p.name},${p.phone}`);

                              const csvContent =
                                "\uFEFF" + "الاسم,رقم الهاتف\n" + rows.join("\n");

                              const blob = new Blob([csvContent], {
                                type: "text/csv;charset=utf-8;"
                              });

                              const url = URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.href = url;
                              link.setAttribute("download", "patients.csv");
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);

                              notify(`✅ تم تصدير ${filtered.length} سجل`);
                              setShowExportMenu(false);
                            }}
                            className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-bold"
                          >
                            Excel
                          </button>

                        </div>
                      </div>
                    )}
                  </div>

                  {/* زر الحذف الجماعي */}
                  {selectedPatients.length > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      className="flex items-center justify-center gap-2
                                bg-red-600 text-white px-6 md:px-8 py-3 md:py-4
                                rounded-xl md:rounded-2xl font-bold
                                shadow-lg shadow-red-100
                                transition-all hover:bg-red-700 hover:shadow-xl
                                transform active:scale-95 text-sm"
                    >
                      <Trash2 size={18} />
                      <span>حذف ({selectedPatients.length})</span>
                    </button>
                  )}

                </div>
              </div>
              {/* ===== END HEADER ===== */}

              {/* ===== TABLE يبدأ زي ما هو عندك بدون أي تعديل ===== */}
                      
                      
          <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scroll">
              <table className="w-full text-right min-w-[100px] md:min-w-[100px]">
                
                <thead>
                  <tr className="bg-gray-50/80 text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                    
                    <th className="px-4 py-3 text-center w-10">
                      <input
                        type="checkbox"
                        checked={
                          paginatedPatients.length > 0 &&
                          paginatedPatients.every(p =>
                            selectedPatients.includes(p.id)
                          )
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPatients(paginatedPatients.map(p => p.id));
                          } else {
                            setSelectedPatients([]);
                          }
                        }}
                        className="accent-teal-600 cursor-pointer"
                      />
                    </th>

                    <th className="px-6 md:px-8 py-4 md:py-5">المريض</th>
                    <th className="px-6 md:px-8 py-4 md:py-5">العمر</th>
                    <th className="px-6 md:px-8 py-4 md:py-5">الجنس</th>
                    <th className="px-6 md:px-8 py-4 md:py-5">السن المصاب</th>
                    <th className="px-6 md:px-8 py-4 md:py-5">آخر إجراء</th>
                    <th className="px-6 md:px-8 py-4 md:py-5">المدفوع</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-red-500">المتبقي</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-center">إجراءات</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50 text-sm">
                  {paginatedPatients.map(p => {
                    const lastRecord = p.treatmentRecords[p.treatmentRecords.length - 1];
                    const remaining = p.totalAmount - p.paidAmount;

                    return (
                      <tr
                        key={p.id}
                        className={`
                          hover:bg-gray-50/30 transition-colors
                          ${highlightedPatients.includes(p.id)
                            ? "patient-soft-highlight"
                            : ""}
                        `}
                      >
                        <td className="px-4 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={selectedPatients.includes(p.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPatients(prev => [...prev, p.id]);
                              } else {
                                setSelectedPatients(prev =>
                                  prev.filter(id => id !== p.id)
                                );
                              }
                            }}
                            className="accent-teal-600 cursor-pointer"
                          />
                        </td>

                        <td className="px-6 md:px-8 py-4 md:py-6">
                          <div className="flex items-center gap-2 md:gap-3">
                            {role === UserRole.DOCTOR && (
                              <button
                                onClick={() => {
                                  setViewingPatient(p);
                                  setIsProfileModalOpen(true);
                                }}
                                className="text-teal-600 hover:bg-teal-50 p-1 md:p-1.5 rounded-full shrink-0"
                              >
                                <UserCircle size={20} />
                              </button>
                            )}

                            <div className="min-w-0">
                              <span className="font-bold text-gray-800 text-sm md:text-base block truncate">
                                {p.name}
                              </span>
                              <div className="text-[10px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                                {p.phone}
                                <a
                                  href={getWhatsAppLink(p.phone)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green-500 hover:text-green-600 shrink-0"
                                >
                                  <WhatsAppIcon size={12} />
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 md:px-8 py-4 md:py-6 text-gray-600">
                          {p.age} سنة
                        </td>

                        <td className="px-6 md:px-8 py-4 md:py-6 text-gray-500 text-xs font-bold">
                          {p.gender}
                        </td>

                        <td className="px-6 md:px-8 py-4 md:py-6">
                          <div className="bg-teal-50 text-teal-700 px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl font-mono font-bold inline-flex whitespace-nowrap overflow-hidden text-ellipsis border border-teal-100 text-xs max-w-full">
                            {
                              lastRecord?.tooth
                                ? lastRecord.tooth
                                    .split(",")
                                    .map(t => {
                                      const clean = t.trim();
                                      const map: any = { "1":"UR", "2":"UL", "3":"LL", "4":"LR" };
                                      return clean.length === 2
                                        ? `${map[clean[0]]}${clean[1]}`
                                        : clean;
                                    })
                                    .join(", ")
                                : "-"
                            }
                          </div>
                        </td>

                        <td className="px-6 md:px-8 py-4 md:py-6">
                        <span
            className="
              px-2 py-1
              bg-gray-100 text-gray-600
              rounded-lg
              text-[10px] font-bold
              border border-gray-200
              inline-flex
              items-center
              whitespace-nowrap
              overflow-hidden
              text-ellipsis
              max-w-full
            "
          >
                            {lastRecord?.type || "مراجعة"}
                          </span>
                        </td>

                        <td className="px-6 md:px-8 py-4 md:py-6 font-bold text-green-600">
                          {p.paidAmount}
                        </td>

                        <td className="px-6 md:px-8 py-4 md:py-6">
                          <span
                            className={`font-bold ${
                              remaining > 0 ? "text-red-500" : "text-gray-400"
                            }`}
                          >
                            {remaining > 0 ? remaining : "مكتمل"}
                          </span>
                        </td>

                        <td className="px-6 md:px-8 py-4 md:py-6">
                          <div className="flex justify-center items-center gap-1 md:gap-2">
                            {role === UserRole.DOCTOR ? (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingPatient({ ...p });
                                    setIsEditTreatmentModalOpen(true);
                                  }}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                  <Edit3 size={16} />
                                </button>

                                <button
                                  onClick={() => {
                                    setEditingPatient({ ...p });
                                    setIsEditPatientInfoModalOpen(true);
                                  }}
                                  className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                                >
                                  <UserCog size={16} />
                                </button>

                                <button
                                  onClick={() => handleDeletePatient(p.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingPatient({ ...p });
                                  setIsPaymentModalOpen(true);
                                }}
                                className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg flex items-center gap-1 transition-all"
                              >
                                <CreditCard size={16} />
                                <span className="text-[10px] font-bold hidden md:inline">
                                  تحصيل
                                </span>
                              </button>
                            )}

                            <button
                              onClick={() => fetchInsight(p)}
                              className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                            >
                              <Info size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="flex justify-center items-center gap-2 py-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 font-bold
                            hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  السابق
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all
                      ${
                        currentPage === i + 1
                          ? "bg-teal-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 font-bold
                            hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  التالي
                </button>
              </div>

            </div>
          </div>
                    </div>
                  )}

          {activeTab === 'schedule' && (
            <div className="bg-white p-4 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in duration-500 overflow-hidden">
              
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 md:mb-10 gap-4">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <CalendarDays className="text-teal-600" /> جدول المواعيد
                </h3>

                <div className="flex items-center bg-teal-50 text-teal-700 p-1 md:p-1.5 rounded-xl md:rounded-2xl border border-teal-100 shadow-sm">
                  <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-teal-100 rounded-lg md:rounded-xl transition-colors">
                    <ChevronRight size={18} />
                  </button>

                  <div className="flex items-center gap-2 md:gap-3 px-4 md:px-8 font-bold text-sm md:text-base min-w-[140px] md:min-w-[220px] justify-center relative group cursor-pointer">
                    <span>{monthLabel}</span>
                    <input
                      type="month"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const [y, m] = e.target.value.split('-');
                        setViewDate(new Date(parseInt(y), parseInt(m) - 1, 1));
                      }}
                    />
                  </div>

                  <button onClick={() => changeMonth(1)} className="p-2 hover:bg-teal-100 rounded-lg md:rounded-xl transition-colors">
                    <ChevronLeft size={18} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto pb-4 custom-scroll">
                <div className="grid grid-cols-7 gap-2 md:gap-4 min-w-[600px]">

                  {/* عناوين الأيام */}
                  {['سبت', 'حد', 'اثنين', 'ثلاثاء', 'اربعاء', 'خميس', 'جمعة'].map(day => (
                    <div key={day} className="text-center font-bold text-gray-400 pb-2 md:pb-5 border-b border-gray-50 text-[10px] md:text-sm uppercase">
                      {day}
                    </div>
                  ))}

                  {/* حساب offset لبداية الشهر */}
                  {
                    Array.from({
                      length:
                        ((new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() + 1) % 7) +
                        new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate()
                    }).map((_, i) => {

                      const offset =
                        (new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() + 1) % 7;

                      // خلايا فارغة قبل بداية الشهر
                      if (i < offset) {
                        return <div key={`empty-${i}`} />;
                      }

                      const dayNumber = i - offset + 1;

                      const fullDateStr = `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1)
                        .toString()
                        .padStart(2, '0')}-${dayNumber.toString().padStart(2, '0')}`;

                      const dayAppointments = patients.filter(p =>
                        p.nextAppointment?.startsWith(fullDateStr)
                      );

                      return (
                        <div
                          key={dayNumber}
                          className={`min-h-[80px] md:min-h-[140px] p-1 md:p-2 rounded-xl md:rounded-[1.5rem] border transition-all ${
                            dayAppointments.length > 0
                              ? 'bg-teal-50/50 border-teal-100 shadow-sm'
                              : 'bg-gray-50/30 border-gray-100'
                          }`}
                        >
                          <span className="text-[8px] md:text-xs font-bold text-gray-300 mb-1 block">
                            {dayNumber}
                          </span>

          {dayAppointments.map(p => {

            const appointmentDate = new Date(p.nextAppointment);
            const now = new Date();

            const isSameDay =
              appointmentDate.getFullYear() === now.getFullYear() &&
              appointmentDate.getMonth() === now.getMonth() &&
              appointmentDate.getDate() === now.getDate();

            const isPast = appointmentDate < now && !isSameDay;

            let borderColor = "border-teal-500";
            let badgeColor = "bg-green-100 text-green-600";
            let badgeText = "قادم";

            if (isSameDay) {
              borderColor = "border-yellow-400";
              badgeColor = "bg-yellow-100 text-yellow-600";
              badgeText = "اليوم";
            }

            if (isPast) {
              borderColor = "border-gray-400";
              badgeColor = "bg-gray-200 text-gray-600";
              badgeText = "انتهى";
            }

            return (
              <div
                key={p.id}
                className={`text-[7px] md:text-[10px] bg-white p-1 md:p-2 rounded-lg md:rounded-xl shadow-sm border-r-2 md:border-r-4 ${borderColor} truncate font-bold mt-1 flex justify-between items-center`}
              >
                <span>
                  {p.nextAppointment?.split('T')[1].slice(0, 5)} - {p.name}
                </span>

                <span className={`text-[6px] md:text-[8px] px-1.5 py-0.5 rounded-full font-bold ${badgeColor}`}>
                  {badgeText}
                </span>
              </div>
            );
          })}


                        </div>
                      );
                    })
                  }

                </div>
              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">

              {role === UserRole.DOCTOR && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-8">


                

                  {/* إجمالي المحصل */}
                  <div className="bg-teal-600 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] text-white shadow-xl shadow-teal-100 transition-transform hover:scale-[1.02]">
                    <p className="opacity-80 text-[10px] md:text-xs font-bold mb-1 md:mb-2 uppercase tracking-widest">
                      إجمالي المحصل
                    </p>
                    <h4 className="text-2xl md:text-3xl font-bold">
                      {totalCollected} <span className="text-xs">ج.م</span>
                    </h4>
                  </div>

                  {/* إجمالي المصاريف */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-gray-400 text-[10px] md:text-xs font-bold mb-1 md:mb-2 uppercase tracking-widest">
                      إجمالي المصاريف
                    </p>
                    <h4 className="text-2xl md:text-3xl font-bold text-red-500">
                      {totalExpenses} <span className="text-xs">ج.م</span>
                    </h4>
                  </div>

                  {/* صافي الربح */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-gray-400 text-[10px] md:text-xs font-bold mb-1 md:mb-2 uppercase tracking-widest">
                      صافي الربح
                    </p>
                    <h4 className={`text-2xl md:text-3xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {netProfit} <span className="text-xs">ج.م</span>
                    </h4>
                  </div>

                  {/* باقي حساب المرضى */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-gray-400 text-[10px] md:text-xs font-bold mb-1 md:mb-2 uppercase tracking-widest">
                      باقي حساب المرضي
                    </p>
                    <h4 className="text-2xl md:text-3xl font-bold text-red-500">
                      {patients.reduce((sum, p) => sum + (p.totalAmount - p.paidAmount), 0)}
                      <span className="text-xs">ج.م</span>
                    </h4>
                  </div>

                  {/* إجمالي العمليات */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <p className="text-gray-400 text-[10px] md:text-xs font-bold mb-1 md:mb-2 uppercase tracking-widest">
                      إجمالي العمليات
                    </p>
                    <h4 className="text-2xl md:text-3xl font-bold text-gray-800">
                      {patients.reduce((sum, p) => sum + p.treatmentRecords.length, 0)}
                    </h4>
                  </div>

                </div>
              )}

{/* 🔵 فلترة التقرير */}
<div className="flex items-center justify-between mb-6">

  <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">

    {/* العنوان */}
    <div className="flex items-center gap-2 text-gray-700 font-semibold">
      <CalendarRange size={18} className="text-teal-600" />
      <span>فلترة التقرير</span>
    </div>

    {/* كلهم في نفس اللاين */}
    <div className="flex items-center gap-3">

      {/* Quick Filters */}
      <button
        onClick={() => {
          const today = new Date();
          const start = new Date();
          start.setDate(today.getDate() - 7);
          setReportStart(start.toISOString().split("T")[0]);
          setReportEnd(today.toISOString().split("T")[0]);
        }}
        className="h-10 px-4 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-xl transition"
      >
        آخر أسبوع
      </button>

      <button
        onClick={() => {
          const today = new Date();
          const start = new Date();
          start.setMonth(today.getMonth() - 1);
          setReportStart(start.toISOString().split("T")[0]);
          setReportEnd(today.toISOString().split("T")[0]);
        }}
        className="h-10 px-4 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-xl transition"
      >
        آخر شهر
      </button>

      <button
        onClick={() => {
          const today = new Date();
          const start = new Date();
          start.setMonth(today.getMonth() - 3);
          setReportStart(start.toISOString().split("T")[0]);
          setReportEnd(today.toISOString().split("T")[0]);
        }}
        className="h-10 px-4 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-xl transition"
      >
        آخر 3 شهور
      </button>

      {/* From */}
      <input
        type="date"
        value={reportStart}
        onChange={(e) => setReportStart(e.target.value)}
        className="h-10 border border-gray-200 rounded-xl px-3 text-sm focus:ring-2 focus:ring-teal-400"
      />

      {/* To */}
      <input
        type="date"
        value={reportEnd}
        onChange={(e) => setReportEnd(e.target.value)}
        className="h-10 border border-gray-200 rounded-xl px-3 text-sm focus:ring-2 focus:ring-teal-400"
      />

    </div>

  </div>

  {/* 🔴 زر إضافة مصروف */}
  <button
    onClick={() => setShowExpenseModal(true)}
    className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-md transition"
  >
    + إضافة مصروف
  </button>

</div>
              
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* سجل الدفعات */}
          <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-lg md:text-xl font-bold mb-6 flex items-center gap-3">
              <Wallet className="text-teal-600" /> سجل الدفعات
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scroll">
              {patients
                .flatMap(p =>
                  p.treatmentRecords.flatMap(r =>
                    (r.payments || []).map(pay => ({
                      ...pay,
                      patientName: p.name,
                      type: r.type,
                      tooth: r.tooth,
                      treatmentId: r.id
                    }))
                  )
                )
                .filter(pay =>
                  pay.date >= reportStart &&
                  pay.date <= reportEnd
                )
                .sort((a, b) => b.date.localeCompare(a.date))
                .map(payment => (
                  <div
                    key={payment.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-bold">{payment.patientName}</p>
                      <p className="text-xs text-gray-400">
                      {payment.type} ({
            payment.tooth
              .split(",")
              .map(t => {
                const clean = t.trim();
                const map: any = { "1":"UR", "2":"UL", "3":"LL", "4":"LR" };
                return clean.length === 2
                  ? `${map[clean[0]]}${clean[1]}`
                  : clean;
              })
              .join(", ")
          })
                      </p>
                    </div>

                    <div className="flex items-center gap-4">

                      <p className="text-green-600 font-bold">
                        {payment.amount} ج.م
                      </p>

                      {/* تعديل */}
                      <button
                        onClick={async () => {
                          const newAmount = prompt("تعديل قيمة الدفعة", payment.amount);
                          if (!newAmount) return;

                          await fetch(`${API_URL}/payments/${payment.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              amount: Number(newAmount)
                            }),
                          });

                          socket.emit("payments:changed");
                          socket.emit("reports:changed");
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-all"
                        title="تعديل"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* حذف */}
                      <button
                        onClick={async () => {
                          if (!window.confirm("هل تريد حذف هذه الدفعة؟")) return;

                          await fetch(`${API_URL}/payments/${payment.id}`, {
                            method: "DELETE",
                          });

                          socket.emit("payments:changed");
                          socket.emit("reports:changed");
                        }}
                        className="text-red-500 hover:text-red-700 transition-all"
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </div>
                ))}
            </div>
          </div>



          {/* سجل المصروفات */}
          {role === UserRole.DOCTOR && (
            <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h3 className="text-lg md:text-xl font-bold mb-6">
                سجل المصروفات
              </h3>

              <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scroll">
                {expenses
                      .filter(exp =>
                        exp.date >= reportStart &&
                        exp.date <= reportEnd
                      )
                      .sort((a, b) =>
                        `${b.date} ${b.time || ""}`.localeCompare(`${a.date} ${a.time || ""}`)
                      )
                      .map(exp => (
                    <div
                      key={exp.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-red-50 rounded-xl gap-3 hover:bg-red-100 transition"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800">
                          {exp.category}
                          {exp.sub_category ? ` - ${exp.sub_category}` : ""}
                        </p>

                        {exp.note && (
                          <p className="text-xs text-gray-400 truncate">
                            {exp.note}
                          </p>
                        )}

                        <p className="text-[10px] text-gray-400 font-mono">
                          {exp.date} {exp.time}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">

                        <p className="font-bold text-red-600 text-lg">
                          {exp.amount} ج.م
                        </p>

                        {/* تعديل */}
                        <button
                          onClick={async () => {
                            const newAmount = prompt("تعديل المبلغ", exp.amount);
                            if (!newAmount) return;

                            await fetch(`${API_URL}/expenses/${exp.id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                ...exp,
                                amount: Number(newAmount)
                              }),
                            });

                            setExpenses(prev =>
                              prev.map(e =>
                                e.id === exp.id
                                  ? { ...e, amount: Number(newAmount) }
                                  : e
                              )
                            );
                          }}
                          className="text-teal-600 hover:text-teal-800 transition"
                        >
                          <Pencil size={18} />
                        </button>

                        {/* حذف */}
                        <button
                          onClick={async () => {
                            if (!window.confirm("هل تريد حذف هذا المصروف؟")) return;

                            await fetch(`${API_URL}/expenses/${exp.id}`, {
                              method: "DELETE",
                            });

                            setExpenses(prev =>
                              prev.filter(e => e.id !== exp.id)
                            );
                          }}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}



          </div>



              {/* مودال إضافة مصروف */}
              {showExpenseModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white w-full max-w-lg p-6 rounded-2xl space-y-4 shadow-2xl">
                    <h3 className="text-lg font-bold">إضافة مصروف جديد</h3>

                    <select
                      value={newExpense.category}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, category: e.target.value, sub_category: "" })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">اختر نوع المصروف</option>
                      <option value="معمل">مصاريف معمل</option>
                      <option value="خامات">مصاريف خامات</option>
                      <option value="شركة الزراعة">مصاريف شركة الزراعة</option>
                      <option value="تشغيل">مصاريف تشغيل</option>
                    </select>

                    {/* ✅ تشغيل + (إضافة صيانة هنا) */}
                    {newExpense.category === "تشغيل" && (
                      <select
                        value={newExpense.sub_category}
                        onChange={(e) =>
                          setNewExpense({ ...newExpense, sub_category: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                      >
                        <option value="">اختر نوع التشغيل</option>
                        <option value="إيجار">إيجار</option>
                        <option value="مرتبات">مرتبات</option>
                        <option value="مياه">مياه</option>
                        <option value="كهرباء">كهرباء</option>
                        <option value="نت">نت</option>
                        <option value="دعاية">دعاية</option>
                        <option value="صيانة">صيانة</option>
                      </select>
                    )}

                    <input
                      type="number"
                      placeholder="المبلغ"
                      value={newExpense.amount}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, amount: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />

                    <input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, date: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />

                    <input
                      type="time"
                      value={newExpense.time}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, time: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />

                    <textarea
                      placeholder="ملاحظة"
                      value={newExpense.note}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, note: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                    />

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        onClick={() => setShowExpenseModal(false)}
                        className="px-4 py-2 bg-gray-200 rounded-lg"
                      >
                        إلغاء
                      </button>

          <button
            onClick={async () => {
              if (
                !newExpense.category ||
                !newExpense.amount ||
                Number(newExpense.amount) <= 0 ||
                !newExpense.date
              ) {
                alert("من فضلك أكمل البيانات بشكل صحيح");
                return;
              }

              const res = await fetch(`${API_URL}/expenses`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  category: newExpense.category,
                  sub_category: newExpense.sub_category,
                  amount: Number(newExpense.amount),
                  date: newExpense.date,
                  time: newExpense.time,
                  note: newExpense.note
                }),
              });

              if (!res.ok) {
                alert("حدث خطأ أثناء الحفظ");
                return;
              }

              const savedExpense = await res.json();

              // إضافة مباشرة للسجل
              setExpenses(prev => [savedExpense, ...prev]);

              setShowExpenseModal(false);

              setNewExpense({
                category: "",
                sub_category: "",
                amount: "",
                date: "",
                time: "",
                note: ""
              });
            }}
            className="px-5 py-2 bg-red-500 text-white rounded-lg font-bold"
          >
            حفظ المصروف
          </button>

                    </div>

                  </div>
                </div>
              )}

            </div>
          )}








        {activeTab === 'reports' && role === UserRole.DOCTOR && (
          <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Filters Section */}
            <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-3"><FileBarChart className="text-teal-600" /> تقارير العيادة التحليلية</h3>
                  <p className="text-xs text-gray-400 mt-1">تتبع نمو العيادة وتوزيع الحالات المرضية</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400">من:</span>
                    <input type="date" className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-teal-500" value={reportStart} onChange={(e) => setReportStart(e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400">إلى:</span>
                    <input type="date" className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-teal-500" value={reportEnd} onChange={(e) => setReportEnd(e.target.value)} />
                  </div>
                  <button className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition-colors shadow-lg shadow-teal-50">
                    <Filter size={14} />
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                <div className="bg-teal-50/50 p-6 rounded-3xl border border-teal-100 flex items-center gap-5">
                  <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                    <Activity size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-teal-600 uppercase mb-1">إجمالي الحالات</p>
                    <h4 className="text-2xl font-bold text-gray-800">{totalCasesInPeriod} حالة</h4>
                  </div>
                </div>
                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex items-center gap-5">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                    <Users size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">المرضى الجدد</p>
                    <h4 className="text-2xl font-bold text-gray-800">{patients.filter(p => p.lastVisit >= reportStart && p.lastVisit <= reportEnd).length} مريض</h4>
                  </div>
                </div>
                <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 flex items-center gap-5">
                  <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                    <DollarSign size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase mb-1">متوسط الدخل لكل حالة</p>
                    <h4 className="text-2xl font-bold text-gray-800">
                      {totalCasesInPeriod > 0 ? Math.round(patients.reduce((sum, p) => sum + p.paidAmount, 0) / totalCasesInPeriod) : 0} <span className="text-xs">ج.م</span>
                    </h4>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
                  <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">توزيع أنواع العلاج</h4>
                  <div className="h-64 md:h-80">
                    {reportData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={reportData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{fill: 'transparent'}} />
                          <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={25}>
                            {reportData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-300 text-sm italic">لا توجد بيانات لهذه الفترة</div>
                    )}
                  </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">جدول توزيع الحالات</h4>
                  <div className="overflow-x-auto custom-scroll">
                    <table className="w-full text-right">
                      <thead>
                        <tr className="text-gray-400 text-[10px] font-bold uppercase border-b border-gray-50">
                          <th className="pb-3 pr-4">نوع الإجراء</th>
                          <th className="pb-3 text-center">العدد</th>
                          <th className="pb-3 text-center">النسبة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.map((item, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-4 pr-4">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                <span className="font-bold text-gray-700 text-sm">{item.name}</span>
                              </div>
                            </td>
                            <td className="py-4 text-center font-bold text-gray-800 text-sm">{item.value}</td>
                            <td className="py-4 text-center">
                              <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                {Math.round((item.value / totalCasesInPeriod) * 100)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {reportData.length === 0 && <p className="text-center py-20 text-gray-400 italic text-sm">لم يتم تسجيل أي إجراءات طبية في هذا ن طاق الزمني</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

{activeTab === 'pricing' && <PricingPage />}


        {/* Modals Section */}

        {/* Add Patient Modal */}
        {isAddPatientModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] max-w-md w-full p-6 md:p-10 shadow-2xl animate-in zoom-in-95 duration-300 border-b-8 border-teal-600">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-3"><Plus className="text-teal-600" /> مريض جديد</h3>
                <button onClick={() => setIsAddPatientModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full"><X size={20} /></button>
              </div>
              <div className="space-y-4 md:space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">الاسم الكامل</label>
                  <input type="text" placeholder="اسم المريض..." className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-100 rounded-xl md:rounded-2xl outline-none bg-gray-50 focus:ring-2 focus:ring-teal-500 text-sm shadow-inner" onChange={(e) => setNewPatient({...newPatient, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">الجنس</label>
                    <select className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-100 rounded-xl md:rounded-2xl outline-none bg-gray-50 focus:ring-2 focus:ring-teal-500 text-sm shadow-inner" value={newPatient.gender} onChange={(e) => setNewPatient({...newPatient, gender: e.target.value as 'ذكر' | 'أنثى'})}><option value="ذكر">ذكر</option><option value="أنثى">أنثى</option></select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">العمر</label>
                    <input type="number" placeholder="العمر..." className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-100 rounded-xl md:rounded-2xl outline-none bg-gray-50 focus:ring-2 focus:ring-teal-500 text-sm shadow-inner" onChange={(e) => setNewPatient({...newPatient, age: Number(e.target.value)})} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">رقم الهاتف</label>
                  <input type="text" placeholder="012XXXXXXXX" className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-100 rounded-xl md:rounded-2xl outline-none bg-gray-50 focus:ring-2 focus:ring-teal-500 text-sm shadow-inner" onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})} />
                </div>
                <div className="flex gap-4 mt-8">
                  <button 
                  type="button"
                  onClick={handleAddPatient}
                   className="flex-1 bg-teal-600 text-white font-bold py-3 md:py-4 rounded-xl md:rounded-2xl hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all transform active:scale-95 text-sm">إضافة المريض</button>
                  <button onClick={() => setIsAddPatientModalOpen(false)} className="flex-1 bg-gray-50 text-gray-500 font-bold py-3 md:py-4 rounded-xl md:rounded-2xl hover:bg-gray-100 text-sm">إلغاء</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Patient Basic Info Modal */}
        {isEditPatientInfoModalOpen && editingPatient && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] max-w-md w-full p-6 md:p-10 shadow-2xl animate-in zoom-in-95 duration-300 border-b-8 border-blue-600">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-3"><UserCog className="text-blue-600" /> تعديل البيانات الأساسية</h3>
                <button onClick={() => setIsEditPatientInfoModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full"><X size={20} /></button>
              </div>
              <div className="space-y-4 md:space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">الاسم الكامل</label>
                  <input type="text" value={editingPatient.name} className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-100 rounded-xl md:rounded-2xl outline-none bg-gray-50 focus:ring-2 focus:ring-blue-500 text-sm" onChange={(e) => setEditingPatient({...editingPatient, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">الجنس</label>
                    <select className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-100 rounded-xl md:rounded-2xl outline-none bg-gray-50 focus:ring-2 focus:ring-blue-500 text-sm" value={editingPatient.gender} onChange={(e) => setEditingPatient({...editingPatient, gender: e.target.value as 'ذكر' | 'أنثى'})}><option value="ذكر">ذكر</option><option value="أنثى">أنثى</option></select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">العمر</label>
                    <input type="number" value={editingPatient.age} className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-100 rounded-xl md:rounded-2xl outline-none bg-gray-50 focus:ring-2 focus:ring-blue-500 text-sm" onChange={(e) => setEditingPatient({...editingPatient, age: Number(e.target.value)})} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">رقم الهاتف</label>
                  <input type="text" value={editingPatient.phone} className="w-full px-4 py-3 md:px-5 md:py-4 border border-gray-100 rounded-xl md:rounded-2xl outline-none bg-gray-50 focus:ring-2 focus:ring-blue-500 text-sm" onChange={(e) => setEditingPatient({...editingPatient, phone: e.target.value})} />
                </div>
                <div className="flex gap-4 mt-8">
                  <button onClick={handleUpdatePatientInfo} className="flex-1 bg-blue-600 text-white font-bold py-3 md:py-4 rounded-xl md:rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all transform active:scale-95 text-sm">حفظ التغييرات</button>
                  <button onClick={() => setIsEditPatientInfoModalOpen(false)} className="flex-1 bg-gray-50 text-gray-500 font-bold py-3 md:py-4 rounded-xl md:rounded-2xl hover:bg-gray-100 text-sm">إلغاء</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Doctor's Edit Treatment Modal */}
        {isEditTreatmentModalOpen && editingPatient && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-start overflow-y-auto p-2 sm:p-4 md:p-8 scroll-smooth">
            <div className="bg-gray-50 rounded-[1.5rem] md:rounded-[2.5rem] max-w-4xl w-full p-4 md:p-8 lg:p-10 shadow-2xl animate-in zoom-in-95 duration-300 border-2 md:border-4 border-white my-2 md:my-4 relative">
              <div className="flex items-center justify-between mb-6 md:mb-8 sticky top-0 bg-gray-50 z-20 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3 md:gap-4 min-w-0">
                  <div className="bg-teal-600 p-2 md:p-3 rounded-xl md:rounded-2xl text-white shadow-lg shrink-0">
                    <Edit3 className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div className="min-w-0"><h3 className="text-base md:text-2xl font-bold text-gray-800 truncate">السجل الطبي والحسابات</h3><p className="text-[10px] md:text-xs text-gray-500 mt-0.5 truncate">{editingPatient.name}</p></div>
                </div>
                <button onClick={() => setIsEditTreatmentModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 bg-white rounded-full shadow-sm shrink-0">
                  <X className="w-[18px] h-[18px] md:w-5 md:h-5" />
                </button>
              </div>
              <div className="space-y-6 md:space-y-8">
                <div className="bg-white p-4 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm border border-gray-100 space-y-4 md:space-y-6">
                  <div className="flex items-center gap-2 text-teal-700 font-bold border-b border-gray-50 pb-3 text-sm md:text-base"><Plus size={16} className="text-teal-600" /><span>إضافة إجراء جديد</span></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div>
  <label className="block text-[8px] md:text-[10px] font-bold text-gray-400 uppercase mb-1.5 md:mb-2 tracking-widest">
    نوع الإجراء
  </label>

 <select
  className="w-full px-3 py-2 md:px-4 md:py-3.5 border border-gray-100 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-teal-500 shadow-sm text-xs md:text-sm"
  value={newProcedure.type}
  onChange={(e) =>
    setNewProcedure({
      ...newProcedure,
      type: e.target.value as TreatmentType,
    })
  }
>
  <option value="">اختر الإجراء...</option>

  {/* إجراءات عامة */}
  <option value="كشف">كشف</option>
  <option value="حشو عادي">حشو عادي</option>
  <option value="حشو عصب">حشو عصب</option>
  <option value="خلع">خلع</option>
  <option value="تنظيف">تنظيف</option>

  {/* تقويم */}
  <optgroup label="تقويم">
    <option value="تقويم">تقويم (جلسة)</option>
    <option value="مقدم تقويم">مقدم تقويم</option>
    <option value="قسط تقويم">قسط تقويم</option>
    <option value="أجهزة تقويم">أجهزة تقويم</option>
  </optgroup>

  {/* تركيبات */}
  <optgroup label="تركيبات - ثابتة">
    <option value="لصق طربوش">لصق طربوش</option>
    <option value="طربوش بورسلين">طربوش بورسلين</option>
    <option value="طربوش زيركون">طربوش زيركون</option>
  </optgroup>

  <optgroup label="تركيبات - متحركة">
    <option value="طقم كامل علوي">طقم كامل علوي</option>
    <option value="طقم كامل سفلي">طقم كامل سفلي</option>
    <option value="تركيبة RPD">تركيبة RPD</option>
  </optgroup>

  <option value="زراعة">زراعة</option>
</select>

</div>


                    <div><label className="block text-[8px] md:text-[10px] font-bold text-gray-400 uppercase mb-1.5 md:mb-2 tracking-widest">التشخيص</label><input type="text" className="w-full px-3 py-2 md:px-4 md:py-3.5 border border-gray-100 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-teal-500 shadow-sm text-xs md:text-sm" placeholder="التشخيص..." value={newProcedure.diagnosis} onChange={(e) => setNewProcedure({...newProcedure, diagnosis: e.target.value})} /></div>
                  </div>
                  
<div className="flex justify-center">
  <div className="max-w-full">

    <DentalFrontalFDI
      selectedTeeth={
        newProcedure.tooth && newProcedure.tooth !== "-"
          ? newProcedure.tooth
  .split(",")
  .map(t => Number(t.trim()))
  .filter(n => !isNaN(n))
          : []
      }
      onSelect={(tooth: number) => {

        const current =
          newProcedure.tooth && newProcedure.tooth !== "-"
            ? newProcedure.tooth
  .split(",")
  .map(t => Number(t.trim()))
  .filter(n => !isNaN(n))
            : [];

        const updated = current.includes(tooth)
          ? current.filter(t => t !== tooth)
          : [...current, tooth];

        setNewProcedure(prev => ({
          ...prev,
          tooth: updated.sort((a,b)=>a-b).join(",")
        }));
      }}
    />

  </div>
</div>



                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-teal-50/30 p-3 md:p-4 rounded-xl md:rounded-2xl border border-teal-50"><label className="block text-[8px] md:text-[9px] font-bold text-teal-600 mb-1.5 uppercase tracking-wider">التكلفة (ج.م)</label><div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-teal-100 shadow-inner"><DollarSign size={14} className="text-teal-600 shrink-0" /><input type="number" className="w-full outline-none bg-transparent font-bold text-teal-900 text-xs md:text-sm" value={newProcedure.cost} onChange={(e) => setNewProcedure({...newProcedure, cost: Number(e.target.value)})} /></div></div>
                    
                  </div>
                  <button onClick={handleAddNewProcedure} disabled={!newProcedure.type} className="w-full py-3.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 shadow-xl shadow-teal-100 text-sm">إضافة للسجل</button>
                </div>
            {editingPatient?.treatmentRecords.map(record => {
  // 🔢 حساب المدفوع الحقيقي والمتبقي
  const totalPaid =
    record.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

  const remaining = record.cost - totalPaid;
  const isCompleted = remaining <= 0;

  return (
    <div
      key={record.id}
      className={`flex justify-between items-center p-3 border rounded-lg ${
        isCompleted ? "bg-green-50" : "bg-gray-50"
      }`}
    >
      <div className="space-y-1">
        {/* اسم الإجراء + الحالة */}
        <div className="font-bold text-sm flex items-center gap-2">
          {record.type}

          {isCompleted && (
            <span className="text-green-600 text-xs font-semibold">
              ✔ اكتمل
            </span>
          )}
        </div>

        <div className="text-xs text-gray-500">
          {record.date} • سن {
  record.tooth
    .split(",")
    .map(t => {
      const clean = t.trim();
      const map: any = { "1":"UR", "2":"UL", "3":"LL", "4":"LR" };
      return clean.length === 2
        ? `${map[clean[0]]}${clean[1]}`
        : clean;
    })
    .join(", ")
}
        </div>

        {/* التكلفة + المتبقي (المتبقي اتنقل هنا) */}
        <div className="text-xs">
          التكلفة: {record.cost} ج.م
          {!isCompleted && (
            <span className="text-red-500 mr-2">
              {" "}
              | المتبقي: {remaining} ج.م
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
  {/* زر التعديل */}
  <button
    className="text-sm text-blue-600 hover:underline"
    onClick={() => {
      setEditingTreatment(record);
      setNewProcedure({
        type: record.type,
        tooth: record.tooth,
        diagnosis: record.diagnosis,
        date: record.date,
        cost: record.cost,
        paid: totalPaid,
        payments: record.payments || [],
      });
    }}
  >
    تعديل
  </button>

  {/* زر الحذف */}
  <button
    type="button"
    className="font-bold text-sm text-red-500 hover:underline"
    onClick={async () => {
      if (!window.confirm("هل أنت متأكد من حذف هذا الإجراء الطبي؟")) {
        return;
      }
      await handleDeleteProcedure(record.id);
    }}
  >
    حذف
  </button>
</div>

    </div>
  );
})}

{/* ===================== الموعد القادم ===================== */}

{/* 🟢 في حالة وجود موعد مستقبلي فقط */}
{editingPatient.nextAppointment &&
  new Date(editingPatient.nextAppointment) > new Date() &&
  !showNextAppointment && (

    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-bold text-teal-700">
            جلسة قادمة محددة
          </div>
          <div className="text-gray-500 text-xs">
            {editingPatient.nextAppointment.split("T")[0]} –{" "}
            {editingPatient.nextAppointment.split("T")[1]?.slice(0, 5)}
          </div>
        </div>

        <div className="flex gap-3">
          {/* تعديل */}
          <button
            type="button"
            onClick={() => {
              const [d, t] = editingPatient.nextAppointment.split("T");
              setNextVisit({ date: d, time: t || "" });
              setShowNextAppointment(true);
            }}
            className="text-teal-600 font-bold text-xs hover:underline"
          >
            تعديل
          </button>

          {/* حذف */}
          <button
            type="button"
            onClick={async () => {
              if (!window.confirm("هل أنت متأكد من حذف الموعد القادم؟")) return;

              await fetch(
                `${API_URL}/patients/${editingPatient.id}/appointment`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ nextAppointment: "" }),
                }
              );

              lastUpdatedPatientId.current = editingPatient.id;

              setEditingPatient(prev =>
                prev ? { ...prev, nextAppointment: "" } : prev
              );
            }}
            className="text-red-500 font-bold text-xs hover:underline"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  )}

{/* 🟢 في حالة وجود موعد مستقبلي فقط */}
{(
  !editingPatient.nextAppointment ||
  new Date(editingPatient.nextAppointment) <= new Date()
) && !showNextAppointment && (
  <button
    type="button"
    onClick={() => {
      setNextVisit({ date: "", time: "" });
      setShowNextAppointment(true);
    }}
    className="text-teal-600 font-bold text-sm hover:underline"
  >
    + إضافة موعد الجلسة القادمة
  </button>
)}

{/* 🟢 وضع الإضافة / التعديل */}
{showNextAppointment && (
  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
    <div>
      <label className="text-xs font-bold text-gray-500">
        التاريخ
      </label>
      <input
        type="date"
        value={nextVisit.date}
        onChange={e =>
          setNextVisit(prev => ({ ...prev, date: e.target.value }))
        }
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>

    <div>
      <label className="text-xs font-bold text-gray-500">
        الوقت
      </label>
      <input
        type="time"
        value={nextVisit.time}
        onChange={e =>
          setNextVisit(prev => ({ ...prev, time: e.target.value }))
        }
        className="w-full border rounded-lg px-3 py-2"
      />
    </div>

    <div className="col-span-2 flex justify-end gap-3">
      <button
        type="button"
        onClick={() => {
          setShowNextAppointment(false);
          setNextVisit({ date: "", time: "" });
        }}
        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-bold text-sm"
      >
        إلغاء
      </button>

      <button
        type="button"
        onClick={async () => {
          if (!nextVisit.date) return;

          const appointmentValue = nextVisit.time
            ? `${nextVisit.date}T${nextVisit.time}`
            : `${nextVisit.date}T00:00`;

          await fetch(
            `${API_URL}/patients/${editingPatient.id}/appointment`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nextAppointment: appointmentValue,
              }),
            }
          );

          lastUpdatedPatientId.current = editingPatient.id;

          notify(`📅 تم حفظ موعد جلسة ${editingPatient.name}`);

          await fetch(`${API_URL}/notifications`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: `📅 تم تحديد موعد جلسة جديدة للمريض 
              <span style="color:#a10e90;font-weight:700">
                ${editingPatient.name}
              </span>`,
              role: "all",
            }),
          });

          setEditingPatient(prev =>
            prev ? { ...prev, nextAppointment: appointmentValue } : prev
          );

          setShowNextAppointment(false);
          setNextVisit({ date: "", time: "" });
        }}
        className="px-5 py-2 bg-teal-600 text-white rounded-lg font-bold text-sm"
      >
        حفظ الموعد
      </button>
    </div>
  </div>
)}





                <div className=
                "flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 sticky bottom-[-16px] md:bottom-[-40px] bg-gray-50 pb-4 z-20">
                <button onClick={handleSaveAllChanges} className="flex-[2] bg-teal-600 text-white font-bold py-3.5 md:py-4 rounded-xl md:rounded-2xl hover:bg-teal-700 shadow-xl shadow-teal-100 transition-all flex items-center justify-center gap-2 text-sm"><Save size={18} />
                <span>حفظ التعديلات</span></button><button onClick={() => setIsEditTreatmentModalOpen(false)} 
                className="flex-1 bg-white text-gray-500 font-bold py-3.5 md:py-4 rounded-xl md:rounded-2xl hover:bg-gray-100 border border-gray-200 shadow-sm transition-all text-sm">إلغاء</button></div>
              </div>
            </div>
          </div>
        )}

{/* Payment Modal */}
{isPaymentModalOpen && editingPatient && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-[2rem] max-w-2xl w-full p-6 md:p-10 shadow-2xl animate-in zoom-in-95 duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800">
            تحصيل الدفعات
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {editingPatient.name}
          </p>
        </div>
        <button
          onClick={() => setIsPaymentModalOpen(false)}
          className="p-2 text-gray-400 hover:bg-gray-50 rounded-full shrink-0"
        >
          <X size={20} />
        </button>
      </div>

      {/* Treatments */}
      <div className="space-y-6 max-h-[60vh] overflow-y-auto px-1 custom-scroll">
        {editingPatient.treatmentRecords.map((record, recordIdx) => {
          const totalPaid =
            record.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

          const remaining = record.cost - totalPaid;
          const isCompleted = remaining <= 0;

          const temp = tempPayments[record.id] || {
            amount: "",
            date: new Date().toISOString().split("T")[0],
          };

          return (
            <div
              key={record.id}
              className={`p-4 md:p-6 rounded-2xl border space-y-4 shadow-sm ${
                isCompleted
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              {/* Title + Cost */}
              <div className="flex justify-between items-center border-b pb-3">
                <div className="font-bold text-xs md:text-sm flex items-center gap-2">
                  {record.type} ({
  record.tooth
    .split(",")
    .map(t => {
      const clean = t.trim();
      const map: any = { "1":"UR", "2":"UL", "3":"LL", "4":"LR" };
      return clean.length === 2
        ? `${map[clean[0]]}${clean[1]}`
        : clean;
    })
    .join(", ")
})
                  {isCompleted && (
                    <span className="text-green-600 text-xs font-semibold">
                      ✔ اكتمل
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-gray-700">
                  {record.cost} ج.م
                  {!isCompleted && (
                    <span className="text-red-500 mr-2">
                      | المتبقي: {remaining}
                    </span>
                  )}
                </div>
              </div>

              {/* Add Payment (only if not completed) */}
              {!isCompleted && (
                <div className="bg-white p-4 rounded-xl border border-teal-50 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] text-gray-400 font-bold block mb-1">
                        المبلغ
                      </label>
                      <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-100 rounded-lg outline-none bg-gray-50 font-bold text-xs"
                        value={temp.amount}
                        onChange={(e) =>
                          setTempPayments(prev => ({
                            ...prev,
                            [record.id]: {
                              ...temp,
                              amount: Number(e.target.value),
                            },
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className="text-[9px] text-gray-400 font-bold block mb-1">
                        التاريخ
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-100 rounded-lg outline-none bg-gray-50 text-xs"
                        value={temp.date}
                        onChange={(e) =>
                          setTempPayments(prev => ({
                            ...prev,
                            [record.id]: {
                              ...temp,
                              date: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddInstallment(recordIdx)}
                    disabled={
                      !temp.amount ||
                      temp.amount <= 0 ||
                      temp.amount > remaining
                    }
                    className="w-full py-2 bg-teal-600 text-white rounded-lg font-bold text-xs disabled:opacity-50"
                  >
                    تسجيل دفعة
                  </button>
                </div>
              )}

              {/* Payments History */}
              {record.payments && record.payments.length > 0 && (
                <div className="pt-2 border-t space-y-1 text-xs">
                  {record.payments.map(p => (
                    <div
                      key={p.id}
                      className="flex justify-between text-gray-600"
                    >
                      <span>{p.amount} ج.م</span>
                      <span>{p.date}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={handleUpdatePayment}
          className="flex-2 bg-teal-600 text-white font-bold py-3.5 md:py-4 rounded-xl md:rounded-2xl hover:bg-teal-700 transition-all w-full text-sm"
        >
          حفظ كافة الدفعات
        </button>
        <button
          onClick={() => setIsPaymentModalOpen(false)}
          className="flex-1 bg-gray-50 text-gray-500 font-bold py-3.5 md:py-4 rounded-xl md:rounded-2xl hover:bg-gray-100 transition-colors text-sm"
        >
          إغلاق
        </button>
      </div>
    </div>
  </div>
)}


        {/* Insight Modal */}
        {clinicalInsight && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-[2rem] max-w-lg w-full p-8 md:p-10 animate-in zoom-in-95 duration-300 border-t-8 border-teal-600 shadow-2xl">
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-teal-800 flex items-center gap-3"><Info className="text-teal-600" /> استشارة ذكية</h3>
              <div className="bg-teal-50/50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-teal-100 text-teal-900 leading-relaxed mb-8 text-sm md:text-base font-medium shadow-inner">{clinicalInsight}</div>
              <button onClick={() => setClinicalInsight(null)} className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl md:rounded-2xl hover:bg-teal-700 shadow-xl shadow-teal-100 transform active:scale-95 text-sm">إغلاق</button>
            </div>
          </div>
        )}
        
        {/* Profile Modal */}
        {isProfileModalOpen && viewingPatient && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] max-w-4xl w-full p-6 md:p-10 shadow-2xl animate-in zoom-in-95 duration-500 my-4 border border-gray-100">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3 md:gap-5 min-w-0">
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-teal-50 text-teal-600 rounded-xl md:rounded-[2rem] flex items-center justify-center shrink-0 shadow-inner border border-teal-100">
                    <UserCircle className="w-8 h-8 md:w-12 md:h-12" />
                  </div>
                  <div className="min-w-0"><h3 className="text-lg md:text-3xl font-bold text-gray-800 truncate">{viewingPatient.name}</h3><div className="flex flex-wrap gap-2 mt-1 md:mt-2"><span className="text-[10px] md:text-sm font-bold text-teal-600 bg-teal-50 px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-teal-100">{viewingPatient.age} سنة</span><span className="text-[10px] md:text-sm font-bold text-gray-500 bg-gray-50 px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-gray-100">{viewingPatient.phone}</span></div></div>
                </div>
                <button onClick={() => setIsProfileModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full shrink-0"><X size={20}/></button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="space-y-4 md:space-y-6">
                  <div className="bg-teal-600 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] text-white shadow-xl shadow-teal-100">
                    <p className="text-[10px] md:text-xs font-bold opacity-70 mb-1 uppercase tracking-widest">المحصل الكلي</p>
                    <h4 className="text-2xl md:text-4xl font-bold">{viewingPatient.paidAmount} <span className="text-xs md:text-sm opacity-60">ج.م</span></h4>
                    <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/10 space-y-2 text-[10px] md:text-xs opacity-80"><div className="flex justify-between"><span>إجمالي الفواتير</span><span>{viewingPatient.totalAmount} ج.م</span></div><div className="flex justify-between font-bold"><span>المتبقي</span><span className="bg-white/20 px-2 rounded-lg">{viewingPatient.totalAmount - viewingPatient.paidAmount} ج.م</span></div></div>
                  </div>
                </div>
              <div className="lg:col-span-2 space-y-4 max-h-[400px] overflow-y-auto custom-scroll pr-1">

  {/* Tabs */}
  <div className="flex gap-3 border-b border-gray-100 pb-2">
    <button
      onClick={() => setProfileTab("treatments")}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
        profileTab === "treatments"
          ? "bg-teal-600 text-white"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      سجل العلاج
    </button>

    <button
      onClick={() => setProfileTab("payments")}
      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
        profileTab === "payments"
          ? "bg-teal-600 text-white"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      سجل الدفع
    </button>
  </div>

  {/* Content */}
  {profileTab === "treatments" ? (

    viewingPatient.treatmentRecords.length > 0 ? (
      [...viewingPatient.treatmentRecords].reverse().map((record) => (
        <div
          key={record.id}
          className="bg-white p-4 md:p-6 rounded-xl md:rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-1 h-full bg-teal-500" />

          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2 md:gap-3">
  
  <p className="font-bold text-gray-800 text-sm md:text-lg truncate whitespace-nowrap">
    {record.type}
  </p>

  <span className="w-8 h-8 md:w-10 md:h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center font-bold text-xs md:text-sm shadow-sm whitespace-nowrap">
    {
      record.tooth
        .split(",")
        .map(t => {
          const clean = t.trim();
          const map: any = { "1":"UR", "2":"UL", "3":"LL", "4":"LR" };
          return clean.length === 2
            ? `${map[clean[0]]}${clean[1]}`
            : clean;
        })
        .join(", ")
    }
  </span>

</div>

            <span className="text-[10px] text-teal-700 font-bold">
              {record.cost} ج.م
            </span>
          </div>

          <p className="text-[10px] md:text-xs text-gray-500 italic mb-3">
            التشخيص: {record.diagnosis || 'لا يوجد'}
          </p>

          <div className="flex justify-between items-center text-[10px] md:text-xs border-t border-gray-50 pt-2">
            <span className="text-gray-400">
              {record.date}
            </span>

            <span
              className={`font-bold ${
                record.cost - record.paid <= 0
                  ? 'text-green-500'
                  : 'text-red-400'
              }`}
            >
              {record.cost - record.paid <= 0
                ? 'مسدد بالكامل'
                : `متبقي: ${record.cost - record.paid} ج.م`}
            </span>
          </div>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-400 py-10 text-sm italic">
        لا يوجد سجلات طبية
      </p>
    )

  ) : (

    (() => {
      const allPayments = viewingPatient.treatmentRecords
        .flatMap(r =>
          (r.payments || []).map(pay => ({
            ...pay,
            type: r.type
          }))
        )
        .sort((a, b) => b.date.localeCompare(a.date));

      return allPayments.length > 0 ? (
        allPayments.map(payment => (
          <div
            key={payment.id}
            className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="font-bold text-gray-800 text-sm">
                {payment.type}
              </p>
              <p className="text-xs text-gray-400">
                {payment.date}
              </p>
            </div>

            <span className="font-bold text-green-600">
              {payment.amount} ج.م
            </span>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-400 py-10 text-sm italic">
          لا يوجد دفعات مسجلة
        </p>
      );
    })()

  )}

</div>

              </div>
              <div className="mt-8 md:mt-10 pt-6 border-t border-gray-100 flex justify-end"><button onClick={() => setIsProfileModalOpen(false)} className="w-full sm:w-auto bg-teal-600 text-white font-bold px-8 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl hover:bg-teal-700 shadow-lg text-sm">إغلاق الملف</button></div>
            </div>
          </div>
        )}
      </div>
    </Layout>
    </NotificationProvider>
  );
};

export default App;
