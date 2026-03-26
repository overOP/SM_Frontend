import { useState, useCallback } from "react";

// 1. Define the shape of our notification settings
export interface NotificationSettings {
  email: boolean;
  attendance: boolean;
  enrollments: boolean;
  events: boolean;
  system: boolean;
}

// 2. Define the type for the specific tabs available
export type SettingsTab = "School" | "Academic" | "Roles" | "Notifications";

// 3. Define the return type of the hook for better consumption in components
interface UseSettingsFormReturn {
  activeTab: SettingsTab;
  setActiveTab: (tab: SettingsTab) => void;
  notifications: NotificationSettings;
  toggleNotification: (key: keyof NotificationSettings) => void;
  showSaved: boolean;
  handleSave: () => void;
}

const useSettingsForm = (): UseSettingsFormReturn => {
  // Initialize state with explicit types
  const [activeTab, setActiveTab] = useState<SettingsTab>("School");
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    attendance: false,
    enrollments: true,
    events: false,
    system: true
  });
  
  const [showSaved, setShowSaved] = useState<boolean>(false);

  // Use 'keyof NotificationSettings' to ensure only valid keys are toggled
  const toggleNotification = useCallback((key: keyof NotificationSettings) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  const handleSave = useCallback(() => {
    // In a real app, you would likely perform an API call here
    setShowSaved(true);
    const timer = setTimeout(() => setShowSaved(false), 2000);
    
    // Cleanup timeout if necessary (optional but good practice)
    return () => clearTimeout(timer);
  }, []);

  return {
    activeTab,
    setActiveTab,
    notifications,
    toggleNotification,
    showSaved,
    handleSave
  };
};

export default useSettingsForm;