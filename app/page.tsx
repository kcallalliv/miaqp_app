"use client";
import { useEffect, useMemo, useState } from "react";
import { Product, CartLine } from "@/lib/types";
import { SHEET_CSV_URL, WAPP_BASE, formatUSD, fetchProducts, BRAND_BLUE } from "@/lib/sheet";
import { cartKey } from "@/lib/utils";
import ProductDetail from "@/components/ProductDetail";
import Testimonials from "@/components/Testimonials";
import TrustBadges from "@/components/TrustBadges";
import PriceCompare from "@/components/PriceCompare";

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<string, CartLine>>({});
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [gen, setGen] = useState("all");
  const [minimized, setMinimized] = useState(false);

  const [openDetail, setOpenDetail] = useState(false);
  const [detailProd, setDetailProd] = useState<Product | null>(null);

  useEffect(() => { (async () => setProducts(await fetchProducts()))(); }, []);

  const cats = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);

  const filtered = products.filter(p => {
    const m1 = cat === "all" || p.category === cat;
    const m2 = gen === "all" || p.gender === gen;
    const m3 = p.name.toLowerCase().includes(search.toLowerCase());
    return m1 && m2 && m3;
  });

  function addToCart(p: Product, size?: string, color?: string, img?: string, q=1) {
    const key = cartKey(p.id, size, color);
    setCart(prev => {
      const ex = prev[key];
      const nextQty = (ex?.qty ?? 0) + q;
      return { ...prev, [key]: { key, id:p.id, name:p.name, price:p.price, size, color, img: img || p.img, qty: nextQty, line: nextQty*p.price } };
    });
  }
  function subLine(key: string, q=1) {
    setCart(prev => {
      const ex = prev[key]; if (!ex) return prev;
      const next = ex.qty - q;
      const cp = { ...prev };
      if (next <= 0) delete cp[key]; else cp[key] = { ...ex, qty: next, line: next*ex.price };
      return cp;
    });
  }
  function removeLine(key: string) { setCart(prev => { const cp = { ...prev }; delete cp[key]; return cp; }); }

  const items = Object.values(cart);
  const total = items.reduce((a,b)=>a+b.line,0);
  const count = items.reduce((a,b)=>a+b.qty,0);

  const waText = useMemo(() => {
    if (!items.length) return encodeURIComponent("Hola MIAQP, quiero hacer un pedido.");
    const lines = items.map(it => `- ${it.qty}x ${it.name}${it.size?` (${it.size})`:``}${it.color?` [${it.color}]`:``} (${formatUSD(it.price)})`).join("%0A");
    const msg = `Hola MIAQP, quiero comprar:%0A${lines}%0A%0ATotal estimado: ${formatUSD(total)} (sin envío/impuestos si aplican).`;
    return encodeURIComponent(decodeURIComponent(msg));
  }, [items, total]);

  function openProduct(p: Product) { setDetailProd(p); setOpenDetail(true); }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#333]">
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 64 64" className="h-10 w-10"><rect x="10" y="14" width="44" height="42" rx="8" fill={BRAND_BLUE}/><rect x="22" y="8" width="20" height="6" rx="2" fill={BRAND_BLUE}/><circle cx="22" cy="58" r="3" fill={BRAND_BLUE}/><circle cx="46" cy="58" r="3" fill={BRAND_BLUE}/><path d="M24 35h14" stroke="#fff" strokeWidth="4" strokeLinecap="round"/><path d="M34 29l8 6-8 6" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="font-bold text-lg">MIAQP</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a className="hover:text-[#2B7A9C]" href="/info">Info</a>
            <a className="hover:text-[#2B7A9C]" href="/faq">FAQ</a>
            <a className="hover:text-[#2B7A9C]" href="/status">Status</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href={`${WAPP_BASE}${waText}`} target="_blank" className="bg-[#2B7A9C] text-white rounded-lg px-4 py-2 font-semibold hover:bg-[#246882]">Haz tu pedido</a>
            <button onClick={()=>setMinimized(m=>!m)} className="relative px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
              {minimized ? "Abrir carrito" : <>Carrito {count>0 && (<span className="ml-1 text-xs bg-[#2B7A9C] text-white px-2 py-0.5 rounded-full">{count}</span>)}</>}
            </button>
          </div>
        </div>
      </header>

      <section className="text-center py-16 bg-gradient-to-b from-[#FAFAFA] to-gray-50">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-5">De Miami a Perú, tus compras <span className="text-[#2B7A9C]">directas de outlet</span></h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-600">Compramos en Dolphin Mall / Sawgrass y lo entregamos en Arequipa/Lima con comisión justa.</p>
        <div className="mt-6 flex gap-3 justify-center">
          <a href="#tienda" className="px-5 py-3 rounded-xl border">Explorar tienda</a>
          <a href={`${WAPP_BASE}${waText}`} target="_blank" className="px-5 py-3 rounded-xl bg-[#2B7A9C] text-white">Pedir por WhatsApp</a>
        </div>
        <div className="max-w-5xl mx-auto px-6"><TrustBadges/></div>
      </section>

      <section id="tienda" className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar producto..." className="border rounded-lg px-3 py-2 flex-1"/>
          <select value={cat} onChange={e=>setCat(e.target.value)} className="border rounded-lg px-3 py-2">
            <option value="all">Todas</option>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={gen} onChange={e=>setGen(e.target.value)} className="border rounded-lg px-3 py-2">
            <option value="all">Todos</option>
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
            <option value="niño">Niño</option>
            <option value="niña">Niña</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="border rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col">
              <div className="h-40 bg-gray-100 grid place-items-center">
                {p.img ? <img src={p.img} alt={p.name} className="h-full object-contain"/> : <div className="text-gray-400 text-sm">Imagen</div>}
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm mr-2">{p.name}</h3>
                  {p.tag && <span className="text-[10px] px-2 py-0.5 rounded-full" style={{background:"#E6F3F8", color:"#2B7A9C"}}>{p.tag}</span>}
                </div>
                <div className="mt-2 text-[#2B7A9C] font-bold">{formatUSD(p.price)}</div>
                <PriceCompare p={p}/>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => openProduct(p)} className="text-[#2B7A9C] underline text-sm">Ver detalles</button>
                  <button onClick={() => addToCart(p)} className="ml-auto bg-[#2B7A9C] text-white rounded-lg px-3 py-2 text-sm font-semibold hover:bg-[#246882]">Agregar rápido</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Testimonials/>

      <div className={`fixed right-4 ${minimized ? "bottom-4" : "bottom-4"} z-30`}>
        {minimized ? (
          <button onClick={()=>setMinimized(false)} className="h-14 w-14 rounded-full shadow-xl bg-[#2B7A9C] text-white font-bold">
            {count}
          </button>
        ) : (
          <div className="w-[340px] max-w-[92vw] rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
            <div className="px-4 py-3 font-semibold bg-gray-50 border-b flex items-center justify-between">
              <span>Carrito ({count})</span>
              <button onClick={()=>setMinimized(true)} className="text-sm underline">Minimizar</button>
            </div>
            <div className="max-h-64 overflow-auto divide-y">
              {items.length === 0 && <div className="p-4 text-sm text-gray-500">Tu carrito está vacío.</div>}
              {items.map(it => (
                <div key={it.key} className="p-4 text-sm flex items-center gap-3">
                  {it.img && <img src={it.img} className="h-10 w-10 object-contain" alt="" />}
                  <div className="flex-1">
                    <div className="font-medium leading-tight">{it.name}</div>
                    <div className="text-gray-500">
                      {it.size?`Talla: ${it.size} · `:""}{it.color?`Color: ${it.color} · `:""}{formatUSD(it.price)} · x{it.qty}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => subLine(it.key)} className="h-7 w-7 border rounded">-</button>
                    <span className="w-6 text-center">{it.qty}</span>
                    <button onClick={() => addToCart({id: it.id, name: it.name, price: it.price, category:'', gender:'unisex'}, it.size, it.color, it.img)} className="h-7 w-7 border rounded">+</button>
                  </div>
                  <button onClick={() => removeLine(it.key)} className="ml-2 text-red-500 hover:underline">Quitar</button>
                </div>
              ))}
            </div>
            <div className="px-4 py-4 border-t bg-white">
              <div className="flex items-center justify-between text-sm">
                <span>Total estimado</span><strong>{formatUSD(total)}</strong>
              </div>
              <a href={`${WAPP_BASE}${waText}`} target="_blank" className="mt-3 block text-center bg-[#2B7A9C] text-white rounded-xl py-2 font-semibold hover:bg-[#246882]">Comprar por WhatsApp</a>
            </div>
          </div>
        )}
      </div>

      {openDetail && detailProd && (
        <ProductDetail product={detailProd} onClose={() => setOpenDetail(false)} onConfirm={(p, size, color, img)=>{ addToCart(p,size,color,img); setOpenDetail(false); }}/>
      )}
    </div>
  );
}
