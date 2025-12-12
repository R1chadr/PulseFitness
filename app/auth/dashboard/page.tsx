"use client";

// ============================================
// IMPORTS
// ============================================
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

// ============================================
// TYPES
// ============================================
interface UserData {
  name: string;
  last_name: string;
  role: string;
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function DashboardPage() {
  // Router
  const router = useRouter();

  // State
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // Computed values
  const fullName = userData 
    ? `${userData.name} ${userData.last_name}` 
    : userEmail;
  const userRole = userData?.role || 'cliente';

  // Effects
  useEffect(() => {
    loadUserData();
  }, [router]);

  // Handlers
  async function loadUserData() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    setUserEmail(user.email || "");

    const { data, error } = await supabase
      .from("users")
      .select("name, last_name, role")
      .eq("auth_id", user.id)
      .single();

    // Redirigir a admin si el usuario es administrador
    if (data?.role === "admin") {
      router.push("/auth/dashboard/admin");
      return;
    }

    setUserData(data);
    setLoading(false);
  }

  // Loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <DashboardHeader userName={fullName} userRole={userRole} />
      <DashboardMain userName={userData?.name} fullName={fullName} />
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

// Loading Screen Component
function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
    </div>
  );
}

// Dashboard Header Component
interface DashboardHeaderProps {
  userName: string;
  userRole: string;
}

function DashboardHeader({ userName, userRole }: DashboardHeaderProps) {
  return (
    <header className="bg-white/80 dark:bg-slate-800/80  border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Logo />
        <UserMenu userName={userName} userRole={userRole} />
      </div>
    </header>
  );
}

// Logo Component
function Logo() {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="w-12 h-12 sm:w-14 sm:h-14 relative flex-shrink-0">
        <Image 
          src="/logo-color.png" 
          alt="Pulse Fitness" 
          fill 
          className="object-contain" 
        />
      </div>
      <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
        Pulse Fitness
      </h1>
    </div>
  );
}

// Dashboard Main Component
interface DashboardMainProps {
  userName?: string;
  fullName: string;
}

function DashboardMain({ userName, fullName }: DashboardMainProps) {
  return (
    <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <WelcomeSection userName={userName} fullName={fullName} />
      <StatsGrid />
      <QuickActions />
    </main>
  );
}

// Welcome Section Component
interface WelcomeSectionProps {
  userName?: string;
  fullName: string;
}

function WelcomeSection({ userName, fullName }: WelcomeSectionProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-emerald-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-white mb-6 sm:mb-8 shadow-xl">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
        ¡Bienvenido de vuelta, {userName}! 👋
      </h2>
      <p className="text-indigo-100 text-base sm:text-lg">
        {fullName}
      </p>
      <p className="text-indigo-100 mt-3 sm:mt-4 text-sm sm:text-base">
        Estás listo para continuar tu viaje fitness
      </p>
    </div>
  );
}

// Stats Grid Component
function StatsGrid() {
  const stats = [
    {
      title: "Entrenamientos",
      icon: "🏋️",
      value: "0",
      description: "Completa tu primer entrenamiento",
      color: "white"
    },
    {
      title: "Racha",
      icon: "🔥",
      value: "0 días",
      description: "¡Comienza tu racha hoy!",
      color: "white"
    },
    {
      title: "Calorías",
      icon: "⚡",
      value: "0",
      description: "Esta semana",
      color: "white",
      colSpan: "sm:col-span-2 lg:col-span-1"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  icon: string;
  value: string;
  description: string;
  colSpan?: string;
}

function StatCard({ title, icon, value, description, colSpan = "" }: StatCardProps) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-lg ${colSpan}`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-semibold">
          {title}
        </h3>
        <span className="text-2xl sm:text-3xl" role="img" aria-label={title}>
          {icon}
        </span>
      </div>
      <p className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
        {value}
      </p>
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

// Quick Actions Component
function QuickActions() {
  const actions = [
    {
      title: "Nuevo entrenamiento",
      description: "Comienza una sesión",
      icon: "🎯",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      hoverBg: "hover:bg-indigo-100 dark:hover:bg-indigo-900/30",
      iconBg: "bg-indigo-600"
    },
    {
      title: "Ver progreso",
      description: "Revisa tus estadísticas",
      icon: "📊",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      hoverBg: "hover:bg-emerald-100 dark:hover:bg-emerald-900/30",
      iconBg: "bg-emerald-600"
    },
    {
      title: "Planificar semana",
      description: "Organiza tus entrenamientos",
      icon: "📅",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      hoverBg: "hover:bg-amber-100 dark:hover:bg-amber-900/30",
      iconBg: "bg-amber-600"
    },
    {
      title: "Comunidad",
      description: "Conecta con otros",
      icon: "🤝",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      hoverBg: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
      iconBg: "bg-purple-600"
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
        Acciones rápidas
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {actions.map((action, index) => (
          <ActionCard key={index} {...action} />
        ))}
      </div>
    </div>
  );
}

// Action Card Component
interface ActionCardProps {
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  hoverBg: string;
  iconBg: string;
}

function ActionCard({ title, description, icon, bgColor, hoverBg, iconBg }: ActionCardProps) {
  return (
    <button className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 ${bgColor} ${hoverBg} rounded-lg sm:rounded-xl transition-colors text-left group`}>
      <div className={`w-10 h-10 sm:w-12 sm:h-12 ${iconBg} rounded-lg flex items-center justify-center text-xl sm:text-2xl group-hover:scale-110 transition-transform flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </button>
  );
}

// ============================================
// USER MENU COMPONENT
// ============================================

interface UserMenuProps {
  userName: string;
  userRole: string;
}

function UserMenu({ userName, userRole }: UserMenuProps) {
  // Router
  const router = useRouter();

  // State
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Handlers
  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function confirmLogout() {
    setShowLogoutModal(false);
    handleLogout();
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function openLogoutModal() {
    setIsMenuOpen(false);
    setShowLogoutModal(true);
  }

  return (
    <>
      <div className="relative">
        <DesktopMenuTrigger userName={userName} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
        <MobileMenuTrigger isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
        
        {isMenuOpen && (
          <DropdownMenu 
            userName={userName} 
            userRole={userRole}
            onClose={closeMenu} 
            onLogout={openLogoutModal} 
          />
        )}
      </div>

      {showLogoutModal && (
        <LogoutModal 
          loading={loading} 
          onClose={() => setShowLogoutModal(false)} 
          onConfirm={confirmLogout} 
        />
      )}
    </>
  );
}

// Desktop Menu Trigger Component
interface DesktopMenuTriggerProps {
  userName: string;
  onToggle: () => void;
}

function DesktopMenuTrigger({ userName, onToggle }: DesktopMenuTriggerProps) {
  return (
    <div className="hidden md:flex items-center gap-3">
      <button
        onClick={() => {
          // TODO: Navegar a perfil
        }}
        className="text-right hover:opacity-80 transition-opacity"
      >
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {userName}
        </p>
      </button>
      <button
        onClick={onToggle}
        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        aria-label="Menú de usuario"
      >
        <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>
    </div>
  );
}

// Mobile Menu Trigger Component
interface MobileMenuTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
}

function MobileMenuTrigger({ isOpen, onToggle }: MobileMenuTriggerProps) {
  return (
    <button
      onClick={onToggle}
      className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
      aria-label="Menú"
    >
      <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        )}
      </svg>
    </button>
  );
}

// Dropdown Menu Component
interface DropdownMenuProps {
  userName: string;
  userRole: string;
  onClose: () => void;
  onLogout: () => void;
}

function DropdownMenu({ userName, userRole, onClose, onLogout }: DropdownMenuProps) {
  const router = useRouter();
  
  const menuItems = [
    {
      label: "Mi Perfil",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      onClick: () => {
        onClose();
        // TODO: Navegar a perfil
      }
    },
    {
      label: "Configuración",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
      onClick: () => {
        onClose();
        // TODO: Navegar a configuración
      }
    },
    {
      label: "Estadísticas",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      onClick: () => {
        onClose();
        // TODO: Navegar a estadísticas
      }
    }
  ];

  // Agregar opción Admin solo si el rol es admin
  const adminMenuItem = {
    label: "Panel Admin",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    onClick: () => {
      onClose();
      router.push('/auth/dashboard/admin');
    },
    isAdmin: true
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-10" onClick={onClose} />
      
      {/* Menu Container */}
      <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 z-20 overflow-hidden">
        {/* User Info Header (Mobile Only) */}
        <button
          onClick={() => {
            onClose();
            // TODO: Navegar a perfil
          }}
          className="md:hidden w-full px-4 py-3 border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left"
        >
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {userName}
          </p>
        </button>

        {/* Menu Items */}
        <div className="py-2">
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}

          {/* Opción Admin solo visible para administradores */}
          {userRole === 'admin' && (
            <>
              <div className="my-2 border-t border-gray-200 dark:border-slate-700" />
              <MenuItem {...adminMenuItem} isAdminItem />
            </>
          )}

          <div className="my-2 border-t border-gray-200 dark:border-slate-700" />

          <LogoutMenuItem onClick={onLogout} />
        </div>
      </div>
    </>
  );
}

// Menu Item Component
interface MenuItemProps {
  label: string;
  icon: string;
  onClick: () => void;
  isAdminItem?: boolean;
}

function MenuItem({ label, icon, onClick, isAdminItem = false }: MenuItemProps) {
  const baseClasses = "w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors";
  const colorClasses = isAdminItem
    ? "hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
    : "hover:bg-gray-100 dark:hover:bg-slate-700";
  const iconColor = isAdminItem
    ? "text-indigo-600 dark:text-indigo-400"
    : "text-gray-600 dark:text-gray-400";
  const textColor = isAdminItem
    ? "text-indigo-700 dark:text-indigo-300"
    : "text-gray-700 dark:text-gray-300";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${colorClasses}`}
    >
      <svg className={`w-5 h-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
      <span className={`text-sm font-medium ${textColor}`}>
        {label}
      </span>
    </button>
  );
}

// Logout Menu Item Component
interface LogoutMenuItemProps {
  onClick: () => void;
}

function LogoutMenuItem({ onClick }: LogoutMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
    >
      <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span className="text-sm font-medium text-red-600 dark:text-red-400">
        Cerrar Sesión
      </span>
    </button>
  );
}

// ============================================
// LOGOUT MODAL COMPONENT
// ============================================

interface LogoutModalProps {
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function LogoutModal({ loading, onClose, onConfirm }: LogoutModalProps) {
  return (
    <div
      className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300 relative border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose} />
        <ModalHeader />
        <ModalContent loading={loading} onCancel={onClose} onConfirm={onConfirm} />
      </div>
    </div>
  );
}

// Close Button Component
interface CloseButtonProps {
  onClick: () => void;
}

function CloseButton({ onClick }: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
      aria-label="Cerrar modal"
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}

// Modal Header Component
function ModalHeader() {
  return (
    <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 text-center">
      <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
          />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-white">
        ¿Cerrar sesión?
      </h3>
    </div>
  );
}

// Modal Content Component
interface ModalContentProps {
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function ModalContent({ loading, onCancel, onConfirm }: ModalContentProps) {
  return (
    <div className="p-6">
      <p className="text-center text-gray-300 mb-6">
        Estás a punto de cerrar tu sesión. Tendrás que iniciar sesión nuevamente para acceder a tu cuenta.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <CancelButton onClick={onCancel} disabled={loading} />
        <ConfirmButton onClick={onConfirm} loading={loading} />
      </div>
    </div>
  );
}

// Cancel Button Component
interface CancelButtonProps {
  onClick: () => void;
  disabled: boolean;
}

function CancelButton({ onClick, disabled }: CancelButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-2xl transition-all duration-200 disabled:opacity-50"
    >
      Cancelar
    </button>
  );
}

// Confirm Button Component
interface ConfirmButtonProps {
  onClick: () => void;
  loading: boolean;
}

function ConfirmButton({ onClick, loading }: ConfirmButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold rounded-2xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4" 
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
            />
          </svg>
          Saliendo...
        </>
      ) : (
        "Cerrar sesión"
      )}
    </button>
  );
}
