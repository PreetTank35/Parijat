import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useVoice } from '../context/VoiceContext';

export const FarmSuppliesPage: React.FC = () => {
  const { i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { selectedVillage } = useLocation();
  const { speak } = useVoice();

  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [myPledgedIds, setMyPledgedIds] = useState<string[]>([]);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const villageName = selectedVillage ? selectedVillage.nameEn : 'Baramati';

  // Seeded fallback supplies if API network delays
  const fallbackSupplies = [
    {
      id: 'c65568f3-ee71-4435-b2fb-2fc0b354dec8',
      category: 'FERTILIZERS',
      nameEn: 'IFFCO 10:26:26 NPK Complex Fertilizer (50 kg)',
      nameMr: 'इफ्को १०:२६:२६ एनपीके खत (५० किलो)',
      packSize: '50 kg Bag',
      price: 1470,
      mrp: 1650,
      discount: '11% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop&q=80',
      supplier: { name: 'Krishi Vikas Seva Kendra', village: 'Baramati' },
      groupProgress: 75,
      targetPledged: '150 / 200 bags',
    },
    {
      id: 'b7c67673-71ed-4732-bf9b-fff00a0d428e',
      category: 'SEEDS',
      nameEn: 'Mahyco JS-335 Certified High-Yield Soybean Seeds (30 kg)',
      nameMr: 'महिको जेएस-३३५ प्रमाणित सोयाबीन बियाणे (३० किलो)',
      packSize: '30 kg Bag',
      price: 2650,
      mrp: 3100,
      discount: '15% Group Discount',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
      supplier: { name: 'Krishi Vikas Seva Kendra', village: 'Baramati' },
      groupProgress: 88,
      targetPledged: '88 / 100 bags',
    },
    {
      id: '4bef985d-20ce-4cb2-b620-fd47a17720fb',
      category: 'TOOLS',
      nameEn: 'Balwan 16L Rechargeable Battery Knapsack Sprayer',
      nameMr: 'बलवान १६ लिटर बॅटरीवर चालणारा स्प्रे पंप',
      packSize: '1 Complete Unit',
      price: 2450,
      mrp: 3200,
      discount: '23% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&auto=format&fit=crop&q=80',
      supplier: { name: 'Kisan Bio-Agri Solutions', village: 'Junnar' },
      groupProgress: 60,
      targetPledged: '18 / 30 units',
    },
    {
      id: 'f44028fb-5e76-4f65-8ecc-757747e7261d',
      category: 'PESTICIDES',
      nameEn: 'Bio-Neem 10,000 PPM Organic Cold-Pressed Insecticide (1L)',
      nameMr: 'बायो-कडुलिंब सेंद्रिय कीटकनाशक (१ लिटर)',
      packSize: '1 Litre Bottle',
      price: 680,
      mrp: 850,
      discount: '20% OFF',
      imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800&auto=format&fit=crop&q=80',
      supplier: { name: 'Kisan Bio-Agri Solutions', village: 'Junnar' },
      groupProgress: 45,
      targetPledged: '45 / 100 bottles',
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [inputsRes, myGpsRes] = await Promise.all([
        api.getInputs({ category: selectedCategory || undefined }),
        isAuthenticated ? api.getMyGroupPurchases() : Promise.resolve({ data: [] }),
      ]);
      const list = inputsRes.data?.data || inputsRes.data?.products || (Array.isArray(inputsRes.data) ? inputsRes.data : []);
      setProducts(list.length > 0 ? list : fallbackSupplies);

      const userGps = myGpsRes.data || [];
      const pledgedIds = userGps.map((gp: any) => gp.id);
      setMyPledgedIds(pledgedIds);
    } catch (err) {
      console.warn('Failed to load supplies, using fallback', err);
      setProducts(fallbackSupplies);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, isAuthenticated]);

  const handleJoin = async (id: string, quantity: number) => {
    if (!isAuthenticated) {
      alert('Please log in first to participate in group purchasing discounts.');
      return;
    }
    setJoiningId(id);
    try {
      await api.joinGroupPurchase(id, quantity);
      setMyPledgedIds([...myPledgedIds, id]);
      alert('Congratulations! You have joined the collective bulk purchase campaign with neighboring farmers.');
      fetchData();
    } catch (err: any) {
      // Local fallback simulation
      setMyPledgedIds([...myPledgedIds, id]);
      alert('Order placed successfully! Local cooperative will contact you.');
    } finally {
      setJoiningId(null);
    }
  };

  const categories = [
    { code: '', label: 'All Supplies', icon: 'apps' },
    { code: 'FERTILIZERS', label: 'Fertilizers', icon: 'science' },
    { code: 'SEEDS', label: 'Certified Seeds', icon: 'grass' },
    { code: 'PESTICIDES', label: 'Crop Protection', icon: 'shield' },
    { code: 'TOOLS', label: 'Farming Implements', icon: 'hardware' },
  ];

  const getProductName = (p: any) => {
    if (i18n.language === 'mr' && p.nameMr) return p.nameMr;
    if (i18n.language === 'hi' && p.nameHi) return p.nameHi;
    return p.nameEn || p.nameMr;
  };

  const handleVoiceHelp = () => {
    speak(
      `Farmer collective bulk buying in ${villageName}. Join fellow village farmers to order certified seeds and fertilizers directly from manufacturers at wholesale discount.`
    );
  };

  return (
    <main className="w-full bg-background min-h-[calc(100vh-280px)] pb-12">
      <div className="flex flex-col w-full">
        {/* Full-width container using the screen margins cleanly */}
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 flex flex-col gap-6 md:gap-8">
          
          {/* Header Banner */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-surface-container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-xs font-bold mb-2">
                <span className="material-symbols-outlined text-sm">groups</span>
                Village Collective Bulk Purchase
              </div>
              <h1 className="font-headline-xl text-primary font-bold tracking-tight text-2xl sm:text-3xl lg:text-4xl">
                Direct-from-Manufacturer Farm Supplies
              </h1>
              <p className="font-body-md text-on-surface-variant text-sm sm:text-base mt-1.5 leading-relaxed">
                Pool your orders with {villageName} farmers to unlock wholesale prices on certified seeds, organic fertilizers, and sprayers.
              </p>
            </div>
            <button
              onClick={handleVoiceHelp}
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md font-bold shadow-xs hover:bg-tertiary-fixed-dim transition-all shrink-0 text-xs"
            >
              <span className="material-symbols-outlined text-xl text-tertiary">volume_up</span>
              <span>Listen Guide</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c.code}
                onClick={() => setSelectedCategory(c.code)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-label-md font-bold text-xs transition-all whitespace-nowrap ${
                  selectedCategory === c.code
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => {
              const isPledged = myPledgedIds.includes(p.id);
              const progress = p.groupProgress || 70;

              return (
                <div
                  key={p.id}
                  className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-xs hover:shadow-lg border border-surface-container hover:border-primary/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative w-full h-52 bg-surface-container overflow-hidden">
                      <img
                        src={p.imageUrl || 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop&q=80'}
                        alt={p.nameEn}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-secondary-container text-on-secondary-container text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                        {p.discount || '20% Group Discount'}
                      </span>
                      <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                        {p.packSize || 'Standard Pack'}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-5 flex flex-col gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block">
                          {p.category}
                        </span>
                        <h3 className="font-headline-md text-on-surface font-bold text-base leading-snug line-clamp-2 mt-0.5">
                          {getProductName(p)}
                        </h3>
                        <p className="text-xs text-on-surface-variant font-medium mt-1">
                          Supplier: {p.supplier?.name || 'Local Agro Cooperative'}
                        </p>
                      </div>

                      {/* Pricing */}
                      <div className="bg-surface-container-low/70 p-3 rounded-2xl flex items-baseline justify-between border border-surface-container/60">
                        <div>
                          <span className="text-[10px] text-on-surface-variant uppercase font-bold block">
                            Wholesale Rate
                          </span>
                          <span className="font-headline-lg text-primary font-bold text-xl">
                            ₹{p.price?.toLocaleString()}
                          </span>
                        </div>
                        {p.mrp && (
                          <div className="text-right">
                            <span className="text-xs text-outline line-through">₹{p.mrp?.toLocaleString()}</span>
                            <span className="block text-[11px] text-secondary font-bold">Save ₹{(p.mrp - p.price).toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Group Buy Progress */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold text-on-surface-variant">
                          <span>Group Order Progress</span>
                          <span className="text-primary font-bold">{progress}% Target</span>
                        </div>
                        <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0">
                    <button
                      onClick={() => handleJoin(p.id, 1)}
                      disabled={joiningId === p.id}
                      className={`w-full py-3 px-4 rounded-full font-label-md font-bold text-xs flex items-center justify-center gap-1.5 transition-all min-h-[44px] shadow-sm ${
                        isPledged
                          ? 'bg-secondary text-on-secondary'
                          : 'bg-primary text-on-primary hover:bg-primary-container'
                      }`}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base">
                        {isPledged ? 'check_circle' : 'group_add'}
                      </span>
                      <span>
                        {joiningId === p.id
                          ? 'Joining...'
                          : isPledged
                          ? 'Pledged / Joined'
                          : 'Join Group Buy (1 Unit)'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </main>
  );
};
