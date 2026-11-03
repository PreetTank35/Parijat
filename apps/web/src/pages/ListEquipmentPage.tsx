import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useVoice } from '../context/VoiceContext';

export const ListEquipmentPage: React.FC = () => {
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { villages, selectedVillageId } = useLocation();
  const { speak } = useVoice();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>('TRACTOR');
  const [villageId, setVillageId] = useState<string>(selectedVillageId || '');
  const [rentalRate, setRentalRate] = useState<number>(750);
  const [rentalUnit, setRentalUnit] = useState<'HOURLY' | 'DAILY'>('HOURLY');
  const [securityDeposit, setSecurityDeposit] = useState<number>(0);
  const [titleEn, setTitleEn] = useState<string>('');
  const [description, setDescription] = useState<string>('Driver included, brand new MRF tyres, fuel efficient, ready for deep ploughing...');
  const [imageUrl, setImageUrl] = useState<string>(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDpmvn-ew7IxRrGV1zgNV_NPcmM5Lvt3YvSH8VzGqpSXU7uMcwVTZdukNOXFG4w8z0TPQUphAI8u3rO0GUtih7RgvVIODcuDTqQwI-0raP8YvQH8-_zB29o0mWSdVrPOtIQpP3sHc1GDWpUvUUGwCWKYuQ6NmdUVt08VSERes6CAtAYeZodF7W3NZ17QRS0LgHBCBoj2-FdgGP3g8KUvYrbAdte7G5f7yWEb_lDL0rgqrsAj5W33dM7Lw'
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 4 high-res verified working photos directly from the design templates
  const samplePhotos = [
    {
      label: 'Mahindra Tractor',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpmvn-ew7IxRrGV1zgNV_NPcmM5Lvt3YvSH8VzGqpSXU7uMcwVTZdukNOXFG4w8z0TPQUphAI8u3rO0GUtih7RgvVIODcuDTqQwI-0raP8YvQH8-_zB29o0mWSdVrPOtIQpP3sHc1GDWpUvUUGwCWKYuQ6NmdUVt08VSERes6CAtAYeZodF7W3NZ17QRS0LgHBCBoj2-FdgGP3g8KUvYrbAdte7G5f7yWEb_lDL0rgqrsAj5W33dM7Lw',
    },
    {
      label: 'Rotavator Tiller',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxUfpTxDv-nlhxrm-4cd1eNKEfTREy681euZsDqhedUg3CegQM7RfUOhkZBiPCwm0xvXNqdTPNMx7qMSLTu2NaaQNvpeEmTc-2TYK26-fKO8F9jNktGPY97zfHsEEYp8-uGT3tIDHj1FwUs7fpggAeU574WL_xCRZsJ8LK7OfJv50aJXdZcZjGie32ur84drC4lqtvNJ7j_ghuphN9yrAfSHsR4f6ERuLIfa8y77poeinJjTk-YiPxUA',
    },
    {
      label: 'Multi-Crop Harvester',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA068Vlb7ti7hbDFHgRpdfUrAi5oPv7nWHztckYRQzKbgjFZFpgNUma5FEzHROXioDzgmSuvmTBS1rEorZmj3pO0LpenfcSKliMkD6Mdv8pE8afmU1dt2XpLjafz6SIEjrqj5rf-nUavwCXU7L4ZhXFt1Q7LTjBGqdrMDaf3HV9cC8mssGArhnKIWZaTmawsf8lHqFIaau6-Zmu2aJSWVL8bYbdyych6p3tqZW3ElDYUONWDxZ1e6HOCw',
    },
    {
      label: 'Power Sprayer Pump',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhLcKLGJntszQKeQxqK13lUINO0cxMjO5rq1_ciUmxbdwoz320syLso9F068zB3Cmd7gEIO11NCXlzRqbL_Pa-NAGwYYtinnMbSQR2S1_1bjrP0X76RxecSIFS8w-IIKP97zyV-fahJwbxu-J42HEMXMOt5g9EXE4tHqC4KoRo8fumSSi3rMJ5DR0XHeTcJQ1kjYA2sujIdiVuXeGn6rgqKWLkFgFUB9MPct1WDUaVa-wbUTzDqoHWGA',
    },
  ];

  const categoryOptions = [
    { code: 'TRACTOR', label: 'Tractor', icon: 'agriculture' },
    { code: 'ROTAVATOR', label: 'Rotavator', icon: 'cyclone' },
    { code: 'HARVESTER', label: 'Harvester', icon: 'grain' },
    { code: 'WATER_PUMP', label: 'Water Pump', icon: 'water_drop' },
    { code: 'SPRAYER', label: 'Sprayer', icon: 'shower' },
    { code: 'PLOUGH', label: 'Plough / Cultivator', icon: 'handyman' },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    const fetchCats = async () => {
      try {
        const res = await api.getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.warn('Failed to load categories', err);
      }
    };
    fetchCats();
    if (!villageId && villages.length > 0) {
      setVillageId(villages[0].id);
    }
  }, [isAuthenticated, villages, villageId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!villageId || !rentalRate) {
      setError('Please select your village and specify the rental rate');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await api.createEquipment({
        categoryCode: selectedCategoryCode,
        villageId,
        titleEn: titleEn || 'Mahindra 575 DI 45HP Tractor',
        description: description || undefined,
        rentalRate,
        rentalUnit,
        securityDeposit: securityDeposit || undefined,
        images: [{ url: imageUrl, isPrimary: true, sortOrder: 0 }],
      });
      alert('Your agricultural machine has been successfully listed on Parijat!');
      navigate('/equipment');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error listing equipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceHelp = () => {
    speak(
      'To list your machine for rent: select the category like tractor or rotavator, pick your village, specify the hourly rental rate, choose a photo, and click list machine for rent.'
    );
  };

  return (
    <main className="w-full bg-background min-h-[calc(100vh-280px)] pb-12">
      <div className="flex flex-col w-full">
        {/* Full-width container using the screen margins cleanly */}
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-3xl border border-surface-container shadow-xs">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-xs font-bold mb-2">
                <span className="material-symbols-outlined text-sm">monetization_on</span>
                Farmer Extra Income Opportunity
              </div>
              <h1 className="font-headline-xl text-primary font-bold tracking-tight text-2xl sm:text-3xl">
                List Your Equipment for Rent
              </h1>
              <p className="font-body-md text-on-surface-variant text-sm mt-1">
                Earn steady daily income by renting idle tractors, rotavators, sprayers, and harvesters to nearby farmers.
              </p>
            </div>
            <button
              onClick={handleVoiceHelp}
              type="button"
              className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md font-bold shadow-xs hover:bg-tertiary-fixed-dim transition-all shrink-0 text-xs"
            >
              <span className="material-symbols-outlined text-xl text-tertiary">volume_up</span>
              <span>Audio Guide</span>
            </button>
          </div>

          {/* Form Container */}
          <div className="bg-surface-container-lowest rounded-3xl border border-surface-container shadow-sm p-6 sm:p-8">
            {error && (
              <div className="mb-6 bg-error-container text-on-error-container p-4 rounded-2xl flex items-center gap-2 font-label-md text-sm">
                <span className="material-symbols-outlined">error</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. Category selection */}
              <div>
                <label className="block font-label-md text-primary font-bold uppercase tracking-wider mb-2 text-xs">
                  1. Equipment Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat.code}
                      type="button"
                      onClick={() => setSelectedCategoryCode(cat.code)}
                      className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                        selectedCategoryCode === cat.code
                          ? 'border-primary bg-primary text-on-primary shadow-sm scale-102 font-bold'
                          : 'border-surface-container bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                      <span className="text-xs font-semibold">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Village location */}
              <div>
                <label className="block font-label-md text-primary font-bold uppercase tracking-wider mb-2 text-xs">
                  2. Location / Village Center
                </label>
                <div className="relative">
                  <select
                    value={villageId}
                    onChange={(e) => setVillageId(e.target.value)}
                    className="w-full h-14 px-4 pr-10 rounded-2xl border border-surface-container bg-surface-container-low text-on-surface font-semibold text-sm outline-none focus:ring-2 focus:ring-primary appearance-none"
                  >
                    {villages.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.nameEn} ({v.taluka}, {v.district})
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>

              {/* 3. Machinery Model & Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-primary font-bold uppercase tracking-wider mb-2 text-xs">
                    3. Machinery Name &amp; Model
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Mahindra 575 DI 45HP Tractor"
                    className="w-full h-14 px-4 rounded-2xl border border-surface-container bg-surface-container-low text-on-surface font-semibold text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-primary font-bold uppercase tracking-wider mb-2 text-xs">
                    Description &amp; Implements Included
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Driver included, with 7-ft rotavator"
                    className="w-full h-14 px-4 rounded-2xl border border-surface-container bg-surface-container-low text-on-surface font-semibold text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* 4. Rates & Billing Units */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-primary font-bold uppercase tracking-wider mb-2 text-xs">
                    Rental Rate (₹ Rupees)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-primary font-bold text-lg">₹</span>
                    <input
                      type="number"
                      min="100"
                      max="10000"
                      step="50"
                      value={rentalRate}
                      onChange={(e) => setRentalRate(Number(e.target.value))}
                      className="w-full h-14 pl-10 pr-4 rounded-2xl border border-surface-container bg-surface-container-low text-on-surface font-bold text-lg outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-md text-primary font-bold uppercase tracking-wider mb-2 text-xs">
                    Billing Unit
                  </label>
                  <div className="grid grid-cols-2 gap-2 h-14">
                    <button
                      type="button"
                      onClick={() => setRentalUnit('HOURLY')}
                      className={`rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 ${
                        rentalUnit === 'HOURLY'
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">schedule</span>
                      <span>Per Hour (₹/hr)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRentalUnit('DAILY')}
                      className={`rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 ${
                        rentalUnit === 'DAILY'
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">today</span>
                      <span>Per Day (₹/day)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 5. Select Photo with verified working images */}
              <div>
                <label className="block font-label-md text-primary font-bold uppercase tracking-wider mb-2 text-xs">
                  4. Select Machine Photo
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {samplePhotos.map((photo) => (
                    <button
                      key={photo.label}
                      type="button"
                      onClick={() => setImageUrl(photo.url)}
                      className={`rounded-2xl overflow-hidden border-2 text-left transition-all ${
                        imageUrl === photo.url
                          ? 'border-primary ring-4 ring-primary/20 scale-102 shadow-md'
                          : 'border-surface-container opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="h-32 w-full bg-surface-container">
                        <img
                          src={photo.url}
                          alt={photo.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2.5 bg-surface-container-lowest text-xs font-bold text-on-surface text-center truncate">
                        {photo.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-full bg-primary hover:bg-primary-container text-on-primary font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 mt-4"
              >
                <span className="material-symbols-outlined text-xl">add_circle</span>
                <span>{loading ? 'Registering Equipment...' : 'List Equipment for Rent Now'}</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
};
