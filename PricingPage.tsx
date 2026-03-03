import React, { useState,useMemo,useEffect } from "react";
import { motion,AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

const PricingPage: React.FC = () => {
  const [pricingMode, setPricingMode] = useState<"simple" | "advanced">("simple");

  // ================== المصاريف ==================
  const [rent, setRent] = useState(0);
  const [salaries, setSalaries] = useState(0);
  const [electricity, setElectricity] = useState(0);
  const [water, setWater] = useState(0);
  const [internet, setInternet] = useState(0);
  const [marketing, setMarketing] = useState(0);
  const [otherExpenses, setOtherExpenses] = useState(0);

  const [monthlyCases, setMonthlyCases] = useState(50);
  const [profitPercent, setProfitPercent] = useState(30);
  const [chairSetupCost, setChairSetupCost] = useState(100);
 const [openCard, setOpenCard] = useState<string | null>("expenses");
 const toggleCard = (card: string) => {
  setOpenCard(prev => (prev === card ? null : card));
};

  const totalMonthlyExpenses =
    rent +
    salaries +
    electricity +
    water +
    internet +
    marketing +
    otherExpenses;

  const expensePerCase =
    monthlyCases > 0 ? totalMonthlyExpenses / monthlyCases : 0;

  // ================== الأجهزة ==================
  const [devices, setDevices] = useState([
  { id: "rotary", name: "Rotary", price: 0, lifetimeYears: 7, mode: "monthly" },
  { id: "apex", name: "Apex", price: 0, lifetimeYears: 7, mode: "monthly" },
  { id: "amalgam", name: "Amalgamator", price: 0, lifetimeYears: 10, mode: "monthly" },
  { id: "light", name: "Light Cure", price: 0, lifetimeYears: 7, mode: "monthly" },
  { id: "xray", name: "X-Ray", price: 0, lifetimeYears: 10, mode: "perCase", usagePerCase: 1 },
  { id: "sensor", name: "Sensor", price: 0, lifetimeYears: 10, mode: "perCase", usagePerCase: 1 }
]);

  const totalDevicesCost = useMemo(() => {
  return devices.reduce((sum, d) => sum + (d.price || 0), 0);
}, [devices]);

  const calculateImageCost = (device: any) => {
    if (
      !device.price ||
      !device.lifetimeYears ||
      !device.imagesPerPatient ||
      monthlyCases <= 0
    )
      return 0;

    const totalImages =
      device.imagesPerPatient *
      monthlyCases *
      12 *
      device.lifetimeYears;

    return device.price / totalImages;
  };

  // ================== الخدمات ==================
  // ================== الخدمات ==================
const [services, setServices] = useState<any[]>([]);

const serviceOptions = [
  "حشو عادي",
  "حشو عصب",
  "حشو أطفال",
  "حشو عصب أطفال",
  "كراون زيركون",
  "كراون بورسلين",
  "كراون إيماكس",
  "تركيبة متحركة",
  "خدمة اخري"
];

const addService = () => {
  setServices([
    ...services,
    {
      id: Date.now(),
      name: serviceOptions[0],
      materials: [{ id: Date.now(), name: "", price: 0, cases: 1 }],
      labCost: 0,
      hasLab: false,
      xrayImages: 0,
      usedDevices: [] as string[]
    }
  ]);
};  

// Animated Total
const [animatedTotal, setAnimatedTotal] = useState(0);

useEffect(() => {
  let start = 0;
  const end = totalMonthlyExpenses;
  const duration = 600;

  if (end === 0) {
    setAnimatedTotal(0);
    return;
  }

  const increment = end / (duration / 16);

  const animate = () => {
    start += increment;
    if (start < end) {
      setAnimatedTotal(start);
      requestAnimationFrame(animate);
    } else {
      setAnimatedTotal(end);
    }
  };

  animate();
}, [totalMonthlyExpenses]);
const [openBreakdownId, setOpenBreakdownId] = useState<number | null>(null);

const [isSubscribed, setIsSubscribed] = useState(false); 
  return (
    <div className="animate-in fade-in duration-500 max-w-6xl mx-auto space-y-8">

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          تسعير الخدمات
        </h2>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">

        {pricingMode === "simple" && (
          <div className="space-y-10">

            {/* ===== المصاريف ===== */}
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  className={`relative group
${!isSubscribed ? "pointer-events-none select-none" : ""}
bg-white/70 backdrop-blur-xl
p-7 md:p-8 rounded-[28px]
border border-white/40
shadow-[0_18px_55px_rgba(0,0,0,0.06)]
hover:-translate-y-1.5
hover:shadow-[0_28px_90px_rgba(0,0,0,0.12)]
transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]
space-y-6 overflow-hidden`}
>

  {/* Glow */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 
  transition duration-700 pointer-events-none
  bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.18),transparent_60%)]" />

  {/* Header (Clickable) */}
  <div
    onClick={() => toggleCard("expenses")}
    className="relative flex items-center justify-between cursor-pointer"
  >
    <h3 className="flex items-center gap-3 
    text-xl font-extrabold tracking-wide text-gray-800">

      <span className="relative">
        <span className="absolute inset-0 bg-teal-500 blur-md opacity-40"></span>
        <span className="relative w-2 h-8 bg-gradient-to-b from-teal-400 to-teal-600 rounded-full"></span>
      </span>

      المصاريف التشغيل الشهرية
    </h3>

    <div className="flex items-center gap-4">
      <div className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
        Monthly Overview
      </div>

      <motion.div
        animate={{ rotate: openCard === "expenses" ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-gray-500"
      >
        ▼
      </motion.div>
    </div>
  </div>

  {/* Collapsible Content */}
  <AnimatePresence>
    {openCard === "expenses" && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden space-y-10 mt-10"
      >

        {/* Inputs Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } }
          }}
          className="grid grid-cols-2 md:grid-cols-3 gap-7"
        >
          {[
            { label: "إيجار", value: rent, set: setRent },
            { label: "مرتبات", value: salaries, set: setSalaries },
            { label: "كهرباء", value: electricity, set: setElectricity },
            { label: "مياه", value: water, set: setWater },
            { label: "إنترنت", value: internet, set: setInternet },
            { label: "دعاية", value: marketing, set: setMarketing },
            { label: "أخرى", value: otherExpenses, set: setOtherExpenses }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.4 }}
              className="hover:-translate-y-1 hover:scale-[1.02] transition-all"
            >
              <Input
                label={item.label}
                value={item.value}
                setValue={item.set}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-7 
        pt-10 border-t border-white/40">
          {[
            { label: "عدد الحالات شهريًا", value: monthlyCases, set: setMonthlyCases },
            { label: "نسبة الربح %", value: profitPercent, set: setProfitPercent },
            { label: "تكلفة تجهيز الكرسي", value: chairSetupCost, set: setChairSetupCost }
          ].map((item, i) => (
            <div
              key={i}
              className="transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
            >
              <Input
                label={item.label}
                value={item.value}
                setValue={item.set}
              />
            </div>
          ))}
        </div>

        {/* Total Box */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
          className="mt-6 rounded-3xl p-8 
          bg-gradient-to-br from-teal-50 via-white to-teal-100/40
          border border-teal-200/60
          shadow-[0_15px_40px_rgba(20,184,166,0.08)]
          flex justify-between items-center"
        >
          <div>
            <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
              Total Monthly Cost
            </div>

            <div className="text-sm font-semibold text-gray-600 mt-1">
              إجمالي المصاريف الشهرية
            </div>
          </div>

          <div className="text-3xl font-extrabold 
          bg-gradient-to-r from-teal-500 to-emerald-600 
          bg-clip-text text-transparent">

            {animatedTotal.toFixed(2)} جنيه
          </div>
        </motion.div>

      </motion.div>
    )}
  </AnimatePresence>

{!isSubscribed && (
  <div className="absolute inset-0 z-50
  bg-white/80 backdrop-blur-md
  flex items-center justify-center
  rounded-[28px]">

    <div className="text-center space-y-3">
      <div className="text-lg font-extrabold text-gray-800">
        🔒 هذه الخدمة خاصة بالمشتركين فقط
      </div>

      <div className="text-sm text-gray-600">
        قم بالاشتراك لتفعيل التسعير الكامل وإدارة التفاصيل
      </div>

      <button
        className="mt-3 px-5 py-2 rounded-2xl
        bg-gradient-to-r from-teal-600 to-emerald-600
        text-white font-bold shadow-md"
      >
        اشترك الآن
      </button>
    </div>
  </div>
)}

</motion.div>

            {/* ===== الأجهزة ===== */}
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
  className="relative group
  bg-white/70 backdrop-blur-xl
  p-8 rounded-[32px]
  border border-gray-200
  shadow-[0_20px_60px_rgba(0,0,0,0.06)]
  hover:shadow-[0_30px_90px_rgba(0,0,0,0.12)]
  transition-all duration-500
  overflow-hidden"
>

  {/* Glow */}
  <div className="absolute inset-0 opacity-0 group-hover:opacity-100
  transition duration-700 pointer-events-none
  bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.18),transparent_60%)]" />

  {/* Header */}
  <div
    onClick={() => toggleCard("devices")}
    className="flex items-center justify-between cursor-pointer relative z-10"
  >
    <h3 className="flex items-center gap-3 text-xl font-extrabold text-gray-800">
      <span className="w-2 h-8 bg-gradient-to-b from-teal-400 to-emerald-600 rounded-full" />
      الأجهزة
    </h3>

    <motion.div
      animate={{ rotate: openCard === "devices" ? 180 : 0 }}
      transition={{ duration: 0.3 }}
      className="text-gray-500"
    >
      ▼
    </motion.div>
  </div>

  <AnimatePresence>
    {openCard === "devices" && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden space-y-8 mt-8"
      >

        {/* Header Row */}
        <div className="grid grid-cols-4 gap-4 text-xs font-bold text-gray-500 pb-3 border-b border-gray-200">
          <div>الجهاز</div>
          <div>سعر الشراء</div>
          <div>العمر (سنة)</div>
          <div>طريقة الإهلاك</div>
        </div>

        {/* Devices */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07 } }
          }}
          className="space-y-5"
        >
          <AnimatePresence>
            {devices.map((device, index) => {
              const isImageDevice = device.mode === "perCase";

              const handleDelete = () => {
                setDevices(devices.filter(d => d.id !== device.id));
              };

              return (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="relative grid grid-cols-4 gap-4 items-start
                  bg-white border border-gray-200
                  rounded-2xl p-5 pl-10
                  shadow-sm hover:shadow-md
                  transition-all duration-300
                  overflow-visible"
                  
                >

                  {/* Delete Button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDelete}
                    className="
                      absolute top-0  left-1
                      bg-red-500 hover:bg-red-600
                      text-white
                      w-8 h-8
                      rounded-full
                      flex items-center justify-center
                      shadow-[0_6px_18px_rgba(239,68,68,0.35)]
                      transition-all duration-300
                      z-20
                      opacity-0 group-hover:opacity-100
                    "
                  >
                    <Trash2 size={15} strokeWidth={2.5} />
                  </motion.button>

                  {/* Name */}
                  <div className="text-sm font-semibold text-gray-700">
                    {["rotary","apex","amalgam","light","xray","sensor"].includes(device.id)
                      ? device.name
                      : (
                        <input
                          type="text"
                          value={device.name}
                          placeholder="اسم الجهاز"
                          onChange={(e) => {
                            const updated = [...devices];
                            updated[index].name = e.target.value;
                            setDevices(updated);
                          }}
                          className="w-full border border-gray-300 bg-white
                          px-3 py-2 rounded-xl text-sm
                          shadow-sm
                          focus:outline-none focus:ring-2 focus:ring-teal-400
                          focus:border-teal-400 transition"
                        />
                      )}
                  </div>

                  {/* Price */}
                  <input
                    type="number"
                    value={device.price || ""}
                    onChange={(e) => {
                      const updated = [...devices];
                      updated[index].price = Number(e.target.value);
                      setDevices(updated);
                    }}
                    className="w-full border border-gray-300 bg-white
                    px-3 py-2 rounded-xl text-sm
                    shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-teal-400
                    focus:border-teal-400 transition"
                  />

                  {/* Lifetime */}
                  <input
                    type="number"
                    value={device.lifetimeYears || ""}
                    onChange={(e) => {
                      const updated = [...devices];
                      updated[index].lifetimeYears = Number(e.target.value);
                      setDevices(updated);
                    }}
                    className="w-full border border-gray-300 bg-white
                    px-3 py-2 rounded-xl text-sm
                    shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-teal-400
                    focus:border-teal-400 transition"
                  />

                  {/* Mode */}
                  <select
                    value={device.mode}
                    onChange={(e) => {
                      const updated = [...devices];
                      updated[index].mode = e.target.value;
                      setDevices(updated);
                    }}
                    className="w-full border border-gray-300 bg-white
                    px-3 py-2 rounded-xl text-sm
                    shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-teal-400
                    focus:border-teal-400 transition"
                  >
                    <option value="monthly">إهلاك شهري</option>
                    <option value="perCase">إهلاك بعدد الاستخدام</option>
                  </select>

                  {/* Xray Section */}
                  <AnimatePresence>
                    {isImageDevice && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="col-span-4 overflow-hidden"
                      >
                        <div className="mt-4 rounded-2xl p-5
                        bg-gradient-to-r from-teal-50 via-white to-teal-100/40
                        border border-teal-200 text-sm space-y-4">

                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-700">
                              عدد الصور / مريض
                            </span>

                            <input
                              type="number"
                              value={device.imagesPerPatient || ""}
                              onChange={(e) => {
                                const updated = [...devices];
                                updated[index].imagesPerPatient = Number(e.target.value);
                                setDevices(updated);
                              }}
                              className="border border-gray-300 bg-white
                              px-3 py-2 rounded-xl text-sm w-32
                              shadow-sm
                              focus:outline-none focus:ring-2 focus:ring-teal-400
                              focus:border-teal-400 transition"
                            />
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="font-bold text-teal-700">
                              تكلفة الصورة الواحدة
                            </span>

                            <span className="font-extrabold text-gray-800">
                              {calculateImageCost(device).toFixed(4)} جنيه
                            </span>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Add Device */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() =>
            setDevices([
              ...devices,
              {
                id: Date.now().toString(),
                name: "",
                price: 0,
                lifetimeYears: 5,
                mode: "monthly",
                imagesPerPatient: 0
              }
            ])
          }
          className="bg-gradient-to-r from-teal-600 to-emerald-600
          text-white px-6 py-3 rounded-2xl font-bold
          shadow-[0_15px_45px_rgba(16,185,129,0.25)]
          hover:shadow-[0_20px_60px_rgba(16,185,129,0.35)]
          transition-all duration-300"
        >
          + إضافة جهاز
        </motion.button>

        {/* Total */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="mt-6 rounded-3xl p-6
          bg-gradient-to-br from-teal-50 via-white to-emerald-50
          border border-teal-200
          flex justify-between items-center shadow-sm"
        >
          <span className="text-sm font-semibold text-gray-600">
            إجمالي قيمة الأجهزة
          </span>

          <span className="text-xl font-extrabold
          bg-gradient-to-r from-teal-600 to-emerald-600
          bg-clip-text text-transparent">
            {totalDevicesCost.toFixed(2)} جنيه
          </span>
        </motion.div>

      </motion.div>
    )}
  </AnimatePresence>
{!isSubscribed && (
  <div className="absolute inset-0 z-50
  bg-white/80 backdrop-blur-md
  flex items-center justify-center
  rounded-[28px]">

    <div className="text-center space-y-3">
      <div className="text-lg font-extrabold text-gray-800">
        🔒 هذه الخدمة خاصة بالمشتركين فقط
      </div>

      <div className="text-sm text-gray-600">
        قم بالاشتراك لتفعيل التسعير الكامل وإدارة التفاصيل
      </div>

      <button
        className="mt-3 px-5 py-2 rounded-2xl
        bg-gradient-to-r from-teal-600 to-emerald-600
        text-white font-bold shadow-md"
      >
        اشترك الآن
      </button>
    </div>
  </div>
)}

</motion.div>

       {/* ===== الخدمات ===== */}
<div className="space-y-8">

  {/* زرار إضافة خدمة */}
  <motion.button
    onClick={addService}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="relative overflow-hidden
    bg-gradient-to-r from-teal-600 to-emerald-600
    text-white px-7 py-3.5 rounded-2xl font-extrabold
    shadow-[0_18px_50px_rgba(16,185,129,0.25)]
    hover:shadow-[0_26px_80px_rgba(16,185,129,0.35)]
    transition-all"
  >
    <span className="relative z-10">+ إضافة خدمة للتسعير</span>
    <span className="absolute inset-0 opacity-0 hover:opacity-100 transition duration-500
    bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_55%)]" />
  </motion.button>

  {services.map((service, sIndex) => {

    const materialsCost = service.materials.reduce(
      (sum: number, m: any) => sum + (m.cases > 0 ? m.price / m.cases : 0),
      0
    );

    const xrayDevice = devices.find(d => d.id === "xray");
    const sensorDevice = devices.find(d => d.id === "sensor");

    const totalImageCostPerImage =
      (xrayDevice ? calculateImageCost(xrayDevice) : 0) +
      (sensorDevice ? calculateImageCost(sensorDevice) : 0);

    const xrayTotalCost = service.xrayImages * totalImageCostPerImage;

    const selectedDevicesCost = service.usedDevices.reduce(
      (sum: number, deviceId: string) => {
        const device = devices.find(d => d.id === deviceId);
        if (!device) return sum;

        const lifetimeMonths = device.lifetimeYears * 12;
        const monthlyDep = device.price / lifetimeMonths;
        const perCase = monthlyCases > 0 ? monthlyDep / monthlyCases : 0;

        return sum + perCase;
      },
      0
    );

    const labCost = service.hasLab ? service.labCost : 0;

    const serviceCost =
      expensePerCase +
      chairSetupCost +
      selectedDevicesCost +
      materialsCost +
      labCost +
      xrayTotalCost;

    const suggestedPrice = serviceCost * (1 + profitPercent / 100);
    const profitValue = suggestedPrice - serviceCost;

    const isOpen = openBreakdownId === service.id;

    return (
      <motion.div
        key={service.id}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative group
        bg-white/70 backdrop-blur-xl
        p-7 md:p-8 rounded-[28px]
        border border-white/40
        shadow-[0_18px_55px_rgba(0,0,0,0.06)]
        hover:-translate-y-1.5
        hover:shadow-[0_28px_90px_rgba(0,0,0,0.12)]
        transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]
        space-y-6 overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none
        bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.16),transparent_60%)]" />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-400/10 blur-[120px] rounded-full
        group-hover:scale-125 transition duration-700" />

        {/* Header Row */}
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative">
              <span className="absolute inset-0 bg-teal-500 blur-md opacity-30"></span>
              <span className="relative w-2 h-8 bg-gradient-to-b from-teal-400 to-emerald-600 rounded-full" />
            </span>

            <div>
              <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                Service Pricing
              </div>

              <select
                value={service.name}
                onChange={(e) => {
                  const updated = [...services];
                  updated[sIndex].name = e.target.value;
                  setServices(updated);
                }}
                className="mt-1 border border-white/60 bg-white/60 backdrop-blur
                px-4 py-2 rounded-2xl font-extrabold text-gray-800
                shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
              >
                {serviceOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* KPIs صغيرة */}
          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1.5 rounded-2xl text-xs font-bold
            bg-teal-50 text-teal-700 border border-teal-200/60">
              Cost: {serviceCost.toFixed(0)} EGP
            </div>

            <div className="px-3 py-1.5 rounded-2xl text-xs font-bold
            bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Suggested: {suggestedPrice.toFixed(0)} EGP
            </div>

            <div className="px-3 py-1.5 rounded-2xl text-xs font-bold
            bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              Profit: {profitValue.toFixed(0)} EGP
            </div>
          </div>
        </div>

        {/* عدد صور الأشعة */}
        <div className="relative grid md:grid-cols-2 gap-4">
          <div className="bg-white/60 border border-white/50 rounded-2xl p-4 shadow-sm">
            <label className="text-xs text-gray-500 font-bold">
              عدد صور الأشعة لهذه الخدمة
            </label>
            <input
              type="number"
              value={service.xrayImages || ""}
              onChange={(e) => {
                const updated = [...services];
                updated[sIndex].xrayImages = Number(e.target.value);
                setServices(updated);
              }}
              className="mt-2 border border-white/70 bg-white/70 backdrop-blur
              px-3 py-2 rounded-2xl w-full font-semibold
              focus:outline-none focus:ring-2 focus:ring-teal-300"
            />
            <div className="mt-2 text-xs text-gray-500">
              تكلفة الصورة الواحدة (X-Ray + Sensor):{" "}
              <span className="font-extrabold text-teal-700">
                {totalImageCostPerImage.toFixed(4)} جنيه
              </span>
            </div>
          </div>

          {/* Toggle Breakdown */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setOpenBreakdownId(isOpen ? null : service.id)}
            className="bg-gradient-to-br from-gray-50 via-white to-teal-50
            border border-white/60 rounded-2xl p-4 shadow-sm
            flex items-center justify-between text-left"
          >
            <div>
              <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                Cost Breakdown
              </div>
              <div className="text-sm font-extrabold text-gray-800 mt-1">
                {isOpen ? "إخفاء التفاصيل" : "عرض التفاصيل"}
              </div>
            </div>

            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="w-10 h-10 rounded-2xl bg-white/70 border border-white/70
              flex items-center justify-center shadow-sm text-gray-700"
            >
              <span className="text-lg leading-none">⌄</span>
            </motion.div>
          </motion.button>
        </div>

        {/* الأجهزة المستخدمة (chips) */}
        <div className="space-y-2">
          <div className="font-extrabold text-sm text-gray-800">الأجهزة المستخدمة</div>

          <div className="flex flex-wrap gap-2">
            {devices
              .filter(d => d.id !== "xray" && d.id !== "sensor")
              .map((device) => {
                const checked = service.usedDevices?.includes(device.id);

                return (
                  <button
                    key={device.id}
                    type="button"
                    onClick={() => {
                      const updated = [...services];
                      const current = updated[sIndex].usedDevices || [];

                      updated[sIndex].usedDevices = checked
                        ? current.filter((id: string) => id !== device.id)
                        : [...current, device.id];

                      setServices(updated);
                    }}
                    className={`px-3 py-2 rounded-2xl text-xs font-extrabold border transition-all
                    ${checked
                      ? "bg-teal-600 text-white border-teal-600 shadow-[0_12px_30px_rgba(13,148,136,0.25)]"
                      : "bg-white/60 text-gray-700 border-white/60 hover:bg-white/80"
                    }`}
                  >
                    {device.name}
                  </button>
                );
              })}
          </div>

          <div className="text-xs text-gray-500">
            تكلفة الأجهزة (للخدمة):{" "}
            <span className="font-extrabold text-gray-800">
              {selectedDevicesCost.toFixed(2)} جنيه
            </span>
          </div>
        </div>

        {/* الخامات */}
        <div className="space-y-3">
          <div className="font-extrabold text-sm text-gray-800">الخامات</div>

          <div className="space-y-3">
            {service.materials.map((mat: any, mIndex: number) => (
              <motion.div
                key={mat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-3"
              >
                <input
                  type="text"
                  placeholder="اسم الخامة"
                  value={mat.name}
                  onChange={(e) => {
                    const updated = [...services];
                    updated[sIndex].materials[mIndex].name = e.target.value;
                    setServices(updated);
                  }}
                  className="border border-white/70 bg-white/70 backdrop-blur
                  px-3 py-2 rounded-2xl font-semibold
                  focus:outline-none focus:ring-2 focus:ring-teal-300"
                />

                <input
                  type="number"
                  placeholder="سعر الشراء"
                  value={mat.price || ""}
                  onChange={(e) => {
                    const updated = [...services];
                    updated[sIndex].materials[mIndex].price = Number(e.target.value);
                    setServices(updated);
                  }}
                  className="border border-white/70 bg-white/70 backdrop-blur
                  px-3 py-2 rounded-2xl font-semibold
                  focus:outline-none focus:ring-2 focus:ring-teal-300"
                />

                <input
                  type="number"
                  placeholder="تكفي كام حالة"
                  value={mat.cases || ""}
                  onChange={(e) => {
                    const updated = [...services];
                    updated[sIndex].materials[mIndex].cases = Number(e.target.value);
                    setServices(updated);
                  }}
                  className="border border-white/70 bg-white/70 backdrop-blur
                  px-3 py-2 rounded-2xl font-semibold
                  focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => {
              const updated = [...services];
              updated[sIndex].materials.push({
                id: Date.now(),
                name: "",
                price: 0,
                cases: 1
              });
              setServices(updated);
            }}
            className="text-teal-700 text-sm font-extrabold hover:underline"
          >
            + إضافة خامة
          </button>

          <div className="text-xs text-gray-500">
            تكلفة الخامات (للحالة):{" "}
            <span className="font-extrabold text-gray-800">
              {materialsCost.toFixed(2)} جنيه
            </span>
          </div>
        </div>

        {/* المعمل */}
        <div className="space-y-2">
          <label className="flex items-center gap-3 text-sm font-extrabold text-gray-800">
            <input
              type="checkbox"
              checked={service.hasLab || false}
              onChange={(e) => {
                const updated = [...services];
                updated[sIndex].hasLab = e.target.checked;
                setServices(updated);
              }}
              className="w-4 h-4"
            />
            إضافة معمل
          </label>

          <AnimatePresence>
            {service.hasLab && (
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 10, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <input
                  type="number"
                  placeholder="تكلفة المعمل"
                  value={service.labCost || ""}
                  onChange={(e) => {
                    const updated = [...services];
                    updated[sIndex].labCost = Number(e.target.value);
                    setServices(updated);
                  }}
                  className="border border-white/70 bg-white/70 backdrop-blur
                  px-3 py-2 rounded-2xl w-full font-semibold
                  focus:outline-none focus:ring-2 focus:ring-teal-300"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Breakdown expandable */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative overflow-hidden rounded-3xl p-5
              bg-gradient-to-br from-gray-50 via-white to-teal-50
              border border-white/60 shadow-sm"
            >
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center justify-between bg-white/60 border border-white/60 rounded-2xl px-4 py-3">
                  <span className="text-gray-700 font-bold">📦 مصاريف تشغيل</span>
                  <span className="font-extrabold text-gray-900">{expensePerCase.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between bg-white/60 border border-white/60 rounded-2xl px-4 py-3">
                  <span className="text-gray-700 font-bold">🪑 تجهيز كرسي</span>
                  <span className="font-extrabold text-gray-900">{chairSetupCost.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between bg-white/60 border border-white/60 rounded-2xl px-4 py-3">
                  <span className="text-gray-700 font-bold">⚙️ أجهزة</span>
                  <span className="font-extrabold text-gray-900">{selectedDevicesCost.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between bg-white/60 border border-white/60 rounded-2xl px-4 py-3">
                  <span className="text-gray-700 font-bold">🧪 خامات</span>
                  <span className="font-extrabold text-gray-900">{materialsCost.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between bg-white/60 border border-white/60 rounded-2xl px-4 py-3">
                  <span className="text-gray-700 font-bold">🏥 معمل</span>
                  <span className="font-extrabold text-gray-900">{labCost.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between bg-white/60 border border-white/60 rounded-2xl px-4 py-3">
                  <span className="text-gray-700 font-bold">📸 أشعة</span>
                  <span className="font-extrabold text-gray-900">{xrayTotalCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/60 flex items-center justify-between">
                <span className="text-sm font-extrabold text-gray-800">الإجمالي</span>
                <span className="text-lg font-extrabold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  {serviceCost.toFixed(2)} جنيه
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* النتيجة */}
        <div className="relative rounded-3xl p-5
        bg-gradient-to-r from-teal-50 via-white to-emerald-50
        border border-teal-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="text-gray-800 font-bold">
              تكلفة الحالة: <span className="font-extrabold">{serviceCost.toFixed(2)}</span> جنيه
            </div>

            <div className="text-emerald-700 font-extrabold">
              السعر المقترح: {suggestedPrice.toFixed(2)} جنيه
            </div>
          </div>

          <div className="mt-2 text-xs text-gray-500">
            ربح متوقع:{" "}
            <span className="font-extrabold text-indigo-700">
              {profitValue.toFixed(2)} جنيه
            </span>{" "}
            (بنسبة {profitPercent}%)
          </div>
        </div>


{!isSubscribed && (
  <div className="absolute inset-0 z-50
  bg-white/80 backdrop-blur-md
  flex items-center justify-center
  rounded-[28px]">

    <div className="text-center space-y-3">
      <div className="text-lg font-extrabold text-gray-800">
        🔒 هذه الخدمة خاصة بالمشتركين فقط
      </div>

      <div className="text-sm text-gray-600">
        قم بالاشتراك لتفعيل التسعير الكامل وإدارة التفاصيل
      </div>

      <button
        className="mt-3 px-5 py-2 rounded-2xl
        bg-gradient-to-r from-teal-600 to-emerald-600
        text-white font-bold shadow-md"
      >
        اشترك الآن
      </button>
    </div>
  </div>
)}
      </motion.div>
    );
  })}
</div>

          </div>
        )}

      </div>
    </div>
  );
};

interface InputProps {
  label: string;
  value: number;
  setValue: (v: number) => void;
}

const Input: React.FC<InputProps> = ({ label, value, setValue }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-bold text-gray-600">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      className="border px-4 py-2 rounded-xl"
    />
  </div>
);

export default PricingPage;