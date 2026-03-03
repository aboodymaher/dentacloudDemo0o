import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Notification = {
  id: number;
  message: string;
  visible: boolean;
  read: boolean;
  createdAt: number;
};

const API_URL = import.meta.env.VITE_API_URL;

const STORAGE_KEY = "dentacloud_notifications";

const notificationSound = new Audio("/notification.mp3");
notificationSound.volume = 0.4;

const playSound = () => {
  notificationSound.currentTime = 0;
  notificationSound.play().catch(() => {});
};

/* ============================= */
/* 🔔 Context Type               */
/* ============================= */

type NotificationContextType = {
  notify: (msg: string) => void;
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
};

const NotificationContext = createContext<NotificationContextType>({
  notify: () => {},
  notifications: [],
  unreadCount: 0,
  markAllAsRead: () => {},
});

export const useNotifications = () => useContext(NotificationContext);
export const useNotify = () => useContext(NotificationContext).notify;

/* ============================= */
/* 🔔 Provider                   */
/* ============================= */

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 🔹 Toast (مؤقت)
  const [toastNotifications, setToastNotifications] = useState<Notification[]>([]);

  // 🔹 سجل دائم (يقرأ من localStorage)
  const [historyNotifications, setHistoryNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const seenRef = useRef<Set<number>>(new Set());
  const sessionInitializedRef = useRef(false);

  /* ============================= */
  /* 🔔 حفظ السجل في localStorage */
  /* ============================= */

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(historyNotifications));
  }, [historyNotifications]);

  /* ============================= */
  /* 🔔 إشعار محلي                */
  /* ============================= */

  const notify = (message: string) => {
    const now = Date.now();

    playSound();

    const newNotification: Notification = {
      id: now,
      message,
      visible: true,
      read: false,
      createdAt: now,
    };

    // Toast
    setToastNotifications((prev) => [
      ...prev,
      { ...newNotification, read: true },
    ]);

    // سجل دائم
    setHistoryNotifications((prev) => [
      newNotification,
      ...prev,
    ]);

    // إخفاء بصري
    setTimeout(() => {
      setToastNotifications((prev) =>
        prev.map((n) =>
          n.id === now ? { ...n, visible: false } : n
        )
      );
    }, 5000);

    // حذف من التوست فقط
    setTimeout(() => {
      setToastNotifications((prev) =>
        prev.filter((n) => n.id !== now)
      );
    }, 7000);
  };

  /* ============================= */
  /* 🔔 إشعارات السيرفر (Polling) */
  /* ============================= */

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/notifications`);
        const data = await res.json();

        if (!Array.isArray(data)) return;

        // أول مرة في الجلسة → تجاهل القديم
        if (!sessionInitializedRef.current) {
          data.forEach((n: any) => {
            if (n?.id != null) {
              seenRef.current.add(Number(n.id));
            }
          });
          sessionInitializedRef.current = true;
          return;
        }

        data.forEach((n: any) => {
          const nid = Number(n?.id);
          const msg = String(n?.message ?? "");
          if (!nid || !msg) return;

          if (seenRef.current.has(nid)) return;
          seenRef.current.add(nid);

          playSound();

          const createdAt = Date.now();

          const newNotification: Notification = {
            id: nid,
            message: msg,
            visible: true,
            read: false,
            createdAt,
          };

          // Toast
          setToastNotifications((prev) => [
            ...prev,
            { ...newNotification, read: true },
          ]);

          // سجل دائم (نقصه لـ 100 إشعار فقط)
          setHistoryNotifications((prev) => [
            newNotification,
            ...prev,
          ].slice(0, 100));

          setTimeout(() => {
            setToastNotifications((prev) =>
              prev.map((p) =>
                p.id === nid ? { ...p, visible: false } : p
              )
            );
          }, 5000);

          setTimeout(() => {
            setToastNotifications((prev) =>
              prev.filter((p) => p.id !== nid)
            );
          }, 7000);
        });
      } catch (err) {
        console.error("Notification polling error", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /* ============================= */
  /* 🔔 Helpers                   */
  /* ============================= */

  const unreadCount = historyNotifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setHistoryNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  /* ============================= */
  /* 🔔 Render                    */
  /* ============================= */

  return (
    <NotificationContext.Provider
      value={{
        notify,
        notifications: historyNotifications,
        unreadCount,
        markAllAsRead,
      }}
    >
      {children}

      {/* Toast UI */}
      <div className="fixed bottom-6 right-6 space-y-3 z-[9999]">
        {toastNotifications.map((n) => (
          <div
            key={n.id}
            className={`
              max-w-sm
              bg-slate-800/70 backdrop-blur-sm
              text-white px-5 py-3 rounded-xl
              shadow-lg
              transform transition-all duration-500 ease-out
              ${
                n.visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }
            `}
          >
            <span dangerouslySetInnerHTML={{ __html: n.message }} />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};