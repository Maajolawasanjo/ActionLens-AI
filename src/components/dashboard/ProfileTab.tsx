"use client";

import { useState } from "react";
import { User, Phone, MapPin, Bell, Shield, Heart } from "lucide-react";

interface ProfileTabProps {
  role: string;
  userName?: string;
  region?: string;
  country?: string;
}

export default function ProfileTab({ 
  role, 
  userName = "Officer", 
  region = "Tana River", 
  country = "Kenya" 
}: ProfileTabProps) {
  // State for notification checkboxes
  const [notifySms, setNotifySms] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);

  // State for medical notes
  const [bloodType, setBloodType] = useState("O+");
  const [allergies, setAllergies] = useState("None");
  const [medicalNotes, setMedicalNotes] = useState("No major medical conditions recorded.");

  // Emergency contact state
  const [emergencyName, setEmergencyName] = useState("Amina Yusuf");
  const [emergencyRelation, setEmergencyRelation] = useState("Spouse");
  const [emergencyPhone, setEmergencyPhone] = useState("+254 712 345 678");

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Header */}
      <div>
        <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block font-bold">
          Stakeholder Account Profile
        </span>
        <h2 className="font-editorial text-xl sm:text-2xl text-[#E2E8F0] mt-1">
          Profile & Emergency Information
        </h2>
        <p className="text-xs text-[#94A3B8] font-sans">
          Configure notifications, saved locations, and emergency medical grids.
        </p>
      </div>

      {saved && (
        <div className="bg-[#2E7D5B]/15 border border-[#2E7D5B]/40 p-3 rounded-xs text-xs text-[#E2E8F0] font-mono">
          ✓ Profile settings and emergency card saved successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PERSONAL DETAILS CARD */}
        <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
          <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-2">
            <User className="h-4 w-4" /> Personal Information
          </h3>
          
          <div className="space-y-3 font-sans text-xs">
            <div className="space-y-1.5">
              <label className="block font-mono text-[#94A3B8] uppercase text-[9px]">Full Name</label>
              <input 
                type="text" 
                defaultValue={userName}
                className="w-full px-3 py-2 bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] focus:outline-none focus:border-[#C5A880] rounded-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block font-mono text-[#94A3B8] uppercase text-[9px]">Role Group</label>
              <input 
                type="text" 
                value={role.toUpperCase()} 
                disabled
                className="w-full px-3 py-2 bg-[#0B111E]/40 border border-[#2E3A4E]/60 text-[#94A3B8] rounded-xs font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block font-mono text-[#94A3B8] uppercase text-[9px]">Region</label>
                <input 
                  type="text" 
                  defaultValue={region}
                  className="w-full px-3 py-2 bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] focus:outline-none focus:border-[#C5A880] rounded-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block font-mono text-[#94A3B8] uppercase text-[9px]">Country</label>
                <input 
                  type="text" 
                  defaultValue={country}
                  className="w-full px-3 py-2 bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] focus:outline-none focus:border-[#C5A880] rounded-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* EMERGENCY CONTACTS */}
        <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
          <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-2">
            <Phone className="h-4 w-4" /> Emergency Contact
          </h3>

          <div className="space-y-3 font-sans text-xs">
            <div className="space-y-1.5">
              <label className="block font-mono text-[#94A3B8] uppercase text-[9px]">Contact Name</label>
              <input 
                type="text" 
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] focus:outline-none focus:border-[#C5A880] rounded-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block font-mono text-[#94A3B8] uppercase text-[9px]">Relationship</label>
                <input 
                  type="text" 
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] focus:outline-none focus:border-[#C5A880] rounded-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block font-mono text-[#94A3B8] uppercase text-[9px]">Phone Number</label>
                <input 
                  type="tel" 
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] focus:outline-none focus:border-[#C5A880] rounded-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* MEDICAL CARDS */}
        <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
          <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-2">
            <Heart className="h-4 w-4" /> Medical Information
          </h3>

          <div className="space-y-3 font-sans text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block font-mono text-[#94A3B8] uppercase text-[9px]">Blood Type</label>
                <input 
                  type="text" 
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] focus:outline-none focus:border-[#C5A880] rounded-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block font-mono text-[#94A3B8] uppercase text-[9px]">Allergies</label>
                <input 
                  type="text" 
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] focus:outline-none focus:border-[#C5A880] rounded-xs"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block font-mono text-[#94A3B8] uppercase text-[9px]">Notes / Pre-existing Conditions</label>
              <textarea 
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-[#0B111E] border border-[#2E3A4E] text-[#E2E8F0] focus:outline-none focus:border-[#C5A880] rounded-xs font-sans text-xs resize-none"
              />
            </div>
          </div>
        </div>

        {/* NOTIFICATION SETTINGS */}
        <div className="bg-[#151D2A] border border-[#2E3A4E] p-5 rounded-xs space-y-4">
          <h3 className="text-xs font-mono text-[#C5A880] uppercase tracking-wider font-bold flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notification Settings
          </h3>

          <div className="space-y-4 font-mono text-[11px]">
            <div className="flex items-center justify-between py-1.5 border-b border-[#2E3A4E]/60">
              <div>
                <span className="text-[#E2E8F0] block font-bold">SMS Early Warnings</span>
                <span className="text-[#94A3B8] font-sans text-[10px]">Receive critical flood alerts via phone.</span>
              </div>
              <input 
                type="checkbox" 
                checked={notifySms}
                onChange={(e) => setNotifySms(e.target.checked)}
                className="h-4 w-4 border-[#2E3A4E] text-[#C5A880] rounded-xs cursor-pointer accent-[#C5A880]"
              />
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#2E3A4E]/60">
              <div>
                <span className="text-[#E2E8F0] block font-bold">Email Briefings</span>
                <span className="text-[#94A3B8] font-sans text-[10px]">Daily threat intelligence digests.</span>
              </div>
              <input 
                type="checkbox" 
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="h-4 w-4 border-[#2E3A4E] text-[#C5A880] rounded-xs cursor-pointer accent-[#C5A880]"
              />
            </div>
            <div className="flex items-center justify-between py-1.5">
              <div>
                <span className="text-[#E2E8F0] block font-bold">App Push Notifications</span>
                <span className="text-[#94A3B8] font-sans text-[10px]">Real-time operational alerts in browser.</span>
              </div>
              <input 
                type="checkbox" 
                checked={notifyPush}
                onChange={(e) => setNotifyPush(e.target.checked)}
                className="h-4 w-4 border-[#2E3A4E] text-[#C5A880] rounded-xs cursor-pointer accent-[#C5A880]"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 pt-2 text-right">
          <button 
            type="submit"
            className="bg-[#C5A880] hover:bg-[#D4B992] text-[#0B111E] text-xs font-bold uppercase tracking-widest py-3 px-8 rounded-xs transition-colors cursor-pointer font-mono"
          >
            Save Information Card
          </button>
        </div>

      </form>
    </div>
  );
}
