import React from 'react';
import { useThemeStore } from '../store/useThemeStore';
import { THEMES } from "../constants";
import { Car, CheckCircle } from "lucide-react";

const PREVIEW_SLOTS = [
  { id: 1, number: "A1", isOccupied: false },
  { id: 2, number: "A2", isOccupied: true },
  { id: 3, number: "B1", isOccupied: false },
  { id: 4, number: "B2", isOccupied: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        {/* Theme selection */}
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">Choose a theme for your parking interface</p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors ${
                theme === t ? "bg-base-200" : "hover:bg-base-200/50"
              }`}
              onClick={() => setTheme(t)}
            >
              <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>
                </div>
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Parking Preview Section */}
        <h3 className="text-lg font-semibold mb-3">Parking Preview</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                  <h3 className="font-medium text-sm">Parking Lot</h3>
                  <p className="text-xs text-base-content/70">Available & Occupied Slots</p>
                </div>

                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100 grid grid-cols-2 gap-4">
                  {PREVIEW_SLOTS.map((slot) => (
                    <div
                      key={slot.id}
                      className={`flex items-center justify-between p-3 rounded-xl shadow-sm border ${
                        slot.isOccupied ? "bg-red-500 text-white" : "bg-green-500 text-white"
                      }`}
                    >
                      <span className="text-sm font-medium">Slot {slot.number}</span>
                      {slot.isOccupied ? <Car size={20} /> : <CheckCircle size={20} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Plate Stack Preview */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-3">Plate Stack Preview</h3>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
