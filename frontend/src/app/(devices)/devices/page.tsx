"use client";

import { useState, useEffect } from "react";
import {
  fetchVisitors,
  deleteVisitor,
  resolveCountries,
  Visitor,
} from "@/actions/categories/visitorActions";
import { apiUrlsForCharts } from "@/actions/constant/constant";
import {
  FaSyncAlt,
  FaUsers,
  FaCalendarDay,
  FaUserSecret,
  FaGlobe,
  FaDesktop,
  FaMobileAlt,
  FaTabletAlt,
  FaTrash,
} from "react-icons/fa";

function parseDevice(ua: string): string {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua))
    return "Mobile";
  return "Desktop";
}

function parseBrowser(ua: string): string {
  if (/edg/i.test(ua)) return "Edge";
  if (/chrome/i.test(ua) && !/chromium/i.test(ua)) return "Chrome";
  if (/firefox/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return "Safari";
  if (/opr|opera/i.test(ua)) return "Opera";
  return "Other";
}

function parseOS(ua: string): string {
  if (/windows/i.test(ua)) return "Windows";
  if (/mac os/i.test(ua)) return "macOS";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Other";
}

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 shadow-sm">
    <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const BarRow = ({
  label,
  count,
  total,
}: {
  label: string;
  count: number;
  total: number;
}) => {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-sm text-gray-600 shrink-0 truncate">
        {label}
      </span>
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-700 w-8 text-right">
        {count}
      </span>
      <span className="text-xs text-gray-400 w-9 text-right">{pct}%</span>
    </div>
  );
};

const isPrivateIp = (ip: string) =>
  ip === "::1" ||
  ip === "localhost" ||
  /^127\./.test(ip) ||
  /^10\./.test(ip) ||
  /^192\.168\./.test(ip) ||
  /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
  /^::ffff:127\./.test(ip);

export default function DevicesPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [countryMap, setCountryMap] = useState<Record<string, string>>({});
  const [geoLoading, setGeoLoading] = useState(false);
  const [cityListings, setCityListings] = useState<
    { name: string; buyers: number }[]
  >([]);

  useEffect(() => {
    fetch(apiUrlsForCharts.GetCityData)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => (Array.isArray(d) ? setCityListings(d) : null))
      .catch(() => {});
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchVisitors();
    setVisitors(data);
    setLoading(false);

    const ips = data.map((v) => v.ipAddress ?? "").filter(Boolean);
    if (ips.length) {
      setGeoLoading(true);
      const map = await resolveCountries(ips);
      setCountryMap(map);
      setGeoLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("devices-scroll");
    if (saved) window.scrollTo(0, parseInt(saved, 10));
    const onScroll = () =>
      sessionStorage.setItem("devices-scroll", String(window.scrollY));
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleDelete = async (id: string) => {
    const prev = [...visitors];
    setVisitors((v) => v.filter((x) => x.id !== id));
    const ok = await deleteVisitor(id);
    if (!ok) setVisitors(prev);
  };

  const todayStr = new Date().toDateString();
  const todayCount = visitors.filter(
    (v) => new Date(v.visitedAt).toDateString() === todayStr,
  ).length;
  const uniqueCount = new Set(visitors.map((v) => v.userId).filter(Boolean))
    .size;

  const deviceCounts: Record<string, number> = {
    Mobile: 0,
    Tablet: 0,
    Desktop: 0,
  };
  const browserCounts: Record<string, number> = {};
  const osCounts: Record<string, number> = {};
  const countryCounts: Record<string, number> = {};

  for (const v of visitors) {
    const ua = v.userAgent || "";
    if (ua) {
      const d = parseDevice(ua);
      const b = parseBrowser(ua);
      const o = parseOS(ua);
      deviceCounts[d]++;
      browserCounts[b] = (browserCounts[b] || 0) + 1;
      osCounts[o] = (osCounts[o] || 0) + 1;
    }
    const country = v.ipAddress
      ? isPrivateIp(v.ipAddress)
        ? "Local"
        : (countryMap[v.ipAddress] ?? undefined)
      : undefined;
    if (country) {
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    }
  }

  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          Device & Visitor Overview
        </h2>
        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
        >
          <FaSyncAlt size={12} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={<FaUsers size={18} className="text-indigo-600" />}
          label="Total Visits"
          value={visitors.length}
          color="bg-indigo-50"
        />
        <StatCard
          icon={<FaCalendarDay size={18} className="text-green-600" />}
          label="Today"
          value={todayCount}
          color="bg-green-50"
        />
        <StatCard
          icon={<FaUserSecret size={18} className="text-purple-600" />}
          label="Unique Users"
          value={uniqueCount}
          color="bg-purple-50"
        />
        <StatCard
          icon={<FaGlobe size={18} className="text-blue-500" />}
          label="Countries"
          value={Object.keys(countryCounts).length || (geoLoading ? "…" : "—")}
          color="bg-blue-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">Device Types</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <FaDesktop className="text-indigo-500 shrink-0" />
              <span className="text-sm text-gray-600 flex-1">Desktop</span>
              <span className="font-bold text-gray-800">
                {deviceCounts.Desktop}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FaMobileAlt className="text-green-500 shrink-0" />
              <span className="text-sm text-gray-600 flex-1">Mobile</span>
              <span className="font-bold text-gray-800">
                {deviceCounts.Mobile}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <FaTabletAlt className="text-orange-500 shrink-0" />
              <span className="text-sm text-gray-600 flex-1">Tablet</span>
              <span className="font-bold text-gray-800">
                {deviceCounts.Tablet}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">Browsers</h3>
          <div className="flex flex-col gap-3">
            {Object.entries(browserCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([b, c]) => (
                <BarRow key={b} label={b} count={c} total={visitors.length} />
              ))}
            {Object.keys(browserCounts).length === 0 && (
              <p className="text-sm text-gray-400">No data yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">
            Operating Systems
          </h3>
          <div className="flex flex-col gap-3">
            {Object.entries(osCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([o, c]) => (
                <BarRow key={o} label={o} count={c} total={visitors.length} />
              ))}
            {Object.keys(osCounts).length === 0 && (
              <p className="text-sm text-gray-400">No data yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            Top Countries
            {geoLoading && (
              <span className="text-xs text-gray-400 font-normal">
                resolving…
              </span>
            )}
          </h3>
          <div className="flex flex-col gap-3">
            {topCountries.map(([country, count]) => (
              <BarRow
                key={country}
                label={country}
                count={count}
                total={visitors.length}
              />
            ))}
            {topCountries.length === 0 && (
              <p className="text-sm text-gray-400">
                {geoLoading ? "Loading…" : "No IP data yet"}
              </p>
            )}
          </div>
        </div>
      </div>

      {cityListings.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-700 mb-5">
            Cities with Most Listings
          </h3>
          <div className="flex items-end gap-3 h-48 overflow-x-auto pb-1">
            {cityListings.map((c) => {
              const max = cityListings[0].buyers;
              const pct = max ? Math.round((c.buyers / max) * 100) : 0;
              return (
                <div
                  key={c.name}
                  className="flex flex-col items-center gap-1 flex-1 min-w-[48px]"
                >
                  <span className="text-xs font-bold text-gray-700">
                    {c.buyers}
                  </span>
                  <div className="w-full flex items-end justify-center">
                    <div
                      className="w-full rounded-t-md bg-indigo-500 transition-all duration-500"
                      style={{ height: `${Math.max(pct * 1.5, 4)}px` }}
                    />
                  </div>
                  <span
                    className="text-[10px] text-gray-500 text-center leading-tight w-full truncate"
                    title={c.name}
                  >
                    {c.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700">Recent Visitors</h3>
          <span className="text-xs text-gray-400">{visitors.length} total</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : visitors.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            No visitor records found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">User ID</th>
                  <th className="px-4 py-3 text-left">IP Address</th>
                  <th className="px-4 py-3 text-left">Country</th>
                  <th className="px-4 py-3 text-left">Device</th>
                  <th className="px-4 py-3 text-left">Browser</th>
                  <th className="px-4 py-3 text-left">OS</th>
                  <th className="px-4 py-3 text-left">Date & Time</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visitors.slice(0, 100).map((v, i) => {
                  const ua = v.userAgent || "";
                  const device = ua ? parseDevice(ua) : "—";
                  const browser = ua ? parseBrowser(ua) : "—";
                  const os = ua ? parseOS(ua) : "—";
                  const country = v.ipAddress
                    ? isPrivateIp(v.ipAddress)
                      ? "Local"
                      : (countryMap[v.ipAddress] ?? (geoLoading ? "…" : "—"))
                    : "—";
                  const deviceIcon =
                    device === "Mobile" ? (
                      <FaMobileAlt className="text-green-500" size={12} />
                    ) : device === "Tablet" ? (
                      <FaTabletAlt className="text-orange-500" size={12} />
                    ) : (
                      <FaDesktop className="text-indigo-500" size={12} />
                    );
                  return (
                    <tr key={v.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-700">
                        {v.userId ? (
                          <span className="truncate max-w-[120px] block">
                            {v.userId}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Anon</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                        {v.ipAddress ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{country}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          {deviceIcon} {device}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{browser}</td>
                      <td className="px-4 py-3 text-gray-600">{os}</td>
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                        {new Date(v.visitedAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                        >
                          <FaTrash size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
