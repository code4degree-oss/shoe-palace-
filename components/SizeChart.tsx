import { X } from 'lucide-react';

interface SizeChartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeChart({ isOpen, onClose }: SizeChartProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white max-w-2xl w-full rounded-none shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-bold font-serif uppercase tracking-wider text-brand-black">Size Guide</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-brand-black transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 font-bold text-gray-700 uppercase tracking-wider text-xs">UK / India</th>
                <th className="px-4 py-3 font-bold text-gray-700 uppercase tracking-wider text-xs">US (Men)</th>
                <th className="px-4 py-3 font-bold text-gray-700 uppercase tracking-wider text-xs">US (Women)</th>
                <th className="px-4 py-3 font-bold text-gray-700 uppercase tracking-wider text-xs">EU</th>
                <th className="px-4 py-3 font-bold text-gray-700 uppercase tracking-wider text-xs">Foot Length (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50/50">
                <td className="px-4 py-3 font-medium text-brand-black">6</td>
                <td className="px-4 py-3 text-gray-600">7</td>
                <td className="px-4 py-3 text-gray-600">8</td>
                <td className="px-4 py-3 text-gray-600">40</td>
                <td className="px-4 py-3 text-gray-600">24.5</td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="px-4 py-3 font-medium text-brand-black">7</td>
                <td className="px-4 py-3 text-gray-600">8</td>
                <td className="px-4 py-3 text-gray-600">9</td>
                <td className="px-4 py-3 text-gray-600">41</td>
                <td className="px-4 py-3 text-gray-600">25.5</td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="px-4 py-3 font-medium text-brand-black">8</td>
                <td className="px-4 py-3 text-gray-600">9</td>
                <td className="px-4 py-3 text-gray-600">10</td>
                <td className="px-4 py-3 text-gray-600">42</td>
                <td className="px-4 py-3 text-gray-600">26.5</td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="px-4 py-3 font-medium text-brand-black">9</td>
                <td className="px-4 py-3 text-gray-600">10</td>
                <td className="px-4 py-3 text-gray-600">11</td>
                <td className="px-4 py-3 text-gray-600">43</td>
                <td className="px-4 py-3 text-gray-600">27.5</td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="px-4 py-3 font-medium text-brand-black">10</td>
                <td className="px-4 py-3 text-gray-600">11</td>
                <td className="px-4 py-3 text-gray-600">12</td>
                <td className="px-4 py-3 text-gray-600">44</td>
                <td className="px-4 py-3 text-gray-600">28.5</td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="px-4 py-3 font-medium text-brand-black">11</td>
                <td className="px-4 py-3 text-gray-600">12</td>
                <td className="px-4 py-3 text-gray-600">13</td>
                <td className="px-4 py-3 text-gray-600">45</td>
                <td className="px-4 py-3 text-gray-600">29.5</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-4 text-xs text-gray-500 italic">
            * Sizes may vary slightly by brand or specific shoe model. Measure your foot from heel to longest toe.
          </p>
        </div>
      </div>
    </div>
  );
}
