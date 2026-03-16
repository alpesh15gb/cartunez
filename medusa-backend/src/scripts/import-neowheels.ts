import {
  ContainerRegistrationKeys,
  ProductStatus
} from "@medusajs/framework/utils"
import {
  createProductsWorkflow,
  createProductCategoriesWorkflow,
  deleteProductsWorkflow
} from "@medusajs/medusa/core-flows"

export default async function importNeoWheels({ container }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query  = container.resolve(ContainerRegistrationKeys.QUERY)

  const SALES_CHANNEL_ID     = "sc_01KKVGK5NNKY1WZS2T69FG7A6M"
  const SHIPPING_PROFILE_ID  = "sp_01KKVGK5S10V8E13J4F57SZZY8"
  const REGION_ID            = "reg_01KKVH69QGNMNB0XC90NXRWN5D"

  logger.info("Neo Wheels FULL import — all 43 models …")

  // ── 1. Cleanup ──────────────────────────────────────────────────────────
  const { data: existing } = await query.graph({
    entity: "product",
    fields: ["id"],
    filters: { handle: { $like: "neo-wheels%" } }
  })
  if (existing.length) {
    await deleteProductsWorkflow(container).run({ input: { ids: existing.map(p => p.id) } })
    logger.info(`  Deleted ${existing.length} old Neo Wheels products`)
  }

  // ── 2. Category ─────────────────────────────────────────────────────────
  let { data: cats } = await query.graph({
    entity: "product_category",
    fields: ["id"],
    filters: { name: "Neo Wheels" }
  })
  let categoryId = cats[0]?.id
  if (!categoryId) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: { product_categories: [{ name: "Neo Wheels", handle: "neo-wheels", is_active: true }] }
    })
    categoryId = result[0].id
  }

  // ── 3. Helpers ──────────────────────────────────────────────────────────
  // Price helper: return price in paise (INR * 100)
  const p = (inr: number) => inr * 100

  // Build a single variant object
  const v = (
    size: string, width: string, pcd: string, offset: string, bore: string,
    finish: "BM" | "SM" | "SL" | "CB+M",
    priceInr: number,
    img: string
  ) => ({
    size, width, pcd, offset, bore, finish,
    finishLabel: finish === "BM" ? "Black Machined"
               : finish === "SM" ? "Silver Machined"
               : finish === "SL" ? "Silver" : "Carbon Black Machined",
    priceInr, img
  })

  // ── 4. All 43 models ────────────────────────────────────────────────────
  // Format: { name, handle, description, variants[] }
  // img paths are relative to /public (served as-is by Next.js)
  const models = [

    // ── TECHNO ─────────────────────────────────────────────────────────────
    {
      name: "Techno", handle: "neo-wheels-techno",
      desc: "Bold 5-spoke alloy engineered for SUVs and crossovers. Available from 12″ to 20″ across multiple PCD options.",
      variants: [
        v("12","5.5","4x100","35","54.1","SM", 4800, "/wheels/techno-16-sm.jpg"),
        v("13","5.5","4x100","35","54.1","SM", 5500, "/wheels/techno-16-sm.jpg"),
        v("14","5.5","4x100","35","54.1","SM", 6200, "/wheels/techno-16-sm.jpg"),
        v("14","5.5","4x100","35","54.1","BM", 6400, "/wheels/techno-17-bm.jpg"),
        v("15","6",  "4x100","35","54.1","SM", 7200, "/wheels/techno-16-sm.jpg"),
        v("15","6",  "4x100","35","54.1","BM", 7400, "/wheels/techno-17-bm.jpg"),
        v("16","7",  "4x100","38","54.1","SM", 8500, "/wheels/techno-16-sm.jpg"),
        v("16","7",  "5x114.3","20","67.5","SM", 9595, "/wheels/techno-16-sm.jpg"),
        v("17","8",  "5x114.3","20","67.5","BM",10910, "/wheels/techno-17-bm.jpg"),
        v("18","8.5","5x114.3","20","67.5","BM",13200, "/wheels/techno-18-bm.jpg"),
        v("18","8.5","5x114.3","20","67.5","SM",13200, "/wheels/techno-16-sm.jpg"),
        v("20","9",  "5x114.3","20","67.5","BM",17285, "/wheels/techno-20-bm.jpg"),
      ]
    },

    // ── SLICE ──────────────────────────────────────────────────────────────
    {
      name: "Slice", handle: "neo-wheels-slice",
      desc: "Sharp ice-cut spoke edges. Available across small cars (4x100) to full SUVs (5x114.3).",
      variants: [
        v("13","5.5","4x100","35","54.1","BM", 5500, "/wheels/slice-17-bm.jpg"),
        v("14","6",  "4x100","35","54.1","BM", 6500, "/wheels/slice-17-bm.jpg"),
        v("15","6",  "4x100","38","54.1","BM", 7500, "/wheels/slice-17-bm.jpg"),
        v("17","7.5","5x114.3","38","67.1","BM",10430, "/wheels/slice-17-bm.jpg"),
        v("18","8.5","5x114.3","38","67.1","BM",13200, "/wheels/slice-18-bm.jpg"),
        v("20","9",  "5x114.3","38","67.1","BM",17285, "/wheels/slice-18-bm.jpg"),
      ]
    },

    // ── THOR ───────────────────────────────────────────────────────────────
    {
      name: "Thor", handle: "neo-wheels-thor",
      desc: "Off-road beast with dual PCD (5x114.3 × 5x139.7). Perfect for Thar, Scorpio, Gurkha.",
      variants: [
        v("16","7","5x114.3","0","70.1","BM",12000, "/wheels/thor-18-bm.jpg"),
        v("17","8","5x114.3","0","70.1","BM",13500, "/wheels/thor-18-bm.jpg"),
        v("18","8.5","5x114.3","0","70.1","BM",15910, "/wheels/thor-18-bm.jpg"),
        v("20","9","5x114.3","0","70.1","BM",19800, "/wheels/thor-18-bm.jpg"),
      ]
    },

    // ── SURYA ──────────────────────────────────────────────────────────────
    {
      name: "Surya", handle: "neo-wheels-surya",
      desc: "Sun-inspired radiating spoke design. A premium choice for compact SUVs.",
      variants: [
        v("15","6.5","4x100","40","54.1","SM", 7850, "/wheels/surya-17-bm.jpg"),
        v("16","7",  "5x114.3","38","67.1","BM", 9300, "/wheels/surya-17-bm.jpg"),
        v("17","8",  "5x114.3","38","67.1","BM",11130, "/wheels/surya-17-bm.jpg"),
      ]
    },

    // ── EXOTIC ─────────────────────────────────────────────────────────────
    {
      name: "Exotic", handle: "neo-wheels-exotic",
      desc: "Flowing elegant spoke design. Fits Maruti Swift, Hyundai i20, Tata Nexon and more.",
      variants: [
        v("14","6.5","4x100","35","54.1","SM", 6200, "/wheels/exotic-16-sm.jpg"),
        v("15","6.5","4x100","35","54.1","SM", 7500, "/wheels/exotic-16-sm.jpg"),
        v("16","7",  "5x114.3","38","67.1","SM", 9595, "/wheels/exotic-16-sm.jpg"),
        v("17","7.5","5x114.3","38","67.1","BM",10500, "/wheels/slice-17-bm.jpg"),
      ]
    },

    // ── OSCAR ──────────────────────────────────────────────────────────────
    {
      name: "Oscar", handle: "neo-wheels-oscar",
      desc: "Classic award-winning multi-spoke design. For Creta, Seltos, Baleno, Altroz.",
      variants: [
        v("14","6.5","4x100","35","54.1","SM", 6450, "/wheels/oscar-15-sm.jpg"),
        v("15","6.5","5x114.3","38","67.1","SM", 7900, "/wheels/oscar-15-sm.jpg"),
        v("16","7",  "5x114.3","38","67.1","SM", 9400, "/wheels/oscar-15-sm.jpg"),
      ]
    },

    // ── ATLAS ──────────────────────────────────────────────────────────────
    {
      name: "Atlas", handle: "neo-wheels-atlas",
      desc: "Rugged multi-spoke design with premium machined finish. Great for sedans and entry SUVs.",
      variants: [
        v("13","5.5","4x100","35","54.1","BM", 5200, "/wheels/atlas.jpg"),
        v("14","6",  "4x100","35","54.1","BM", 6100, "/wheels/atlas.jpg"),
        v("15","6",  "4x100","38","54.1","BM", 7100, "/wheels/atlas.jpg"),
        v("16","7",  "4x100","38","54.1","SM", 8400, "/wheels/atlas.jpg"),
        v("16","7",  "5x114.3","38","67.1","BM", 8900, "/wheels/atlas.jpg"),
        v("17","7.5","5x114.3","38","67.1","BM",10500, "/wheels/atlas.jpg"),
      ]
    },

    // ── CRYSTAL ────────────────────────────────────────────────────────────
    {
      name: "Crystal", handle: "neo-wheels-crystal",
      desc: "Multi-spoke crystal-cut design for hatchbacks, sedans and SUVs. Available 14\"–18\".",
      variants: [
        v("14","6",  "4x100","35","54.1","BM", 6300, "/wheels/crystal.jpg"),
        v("14","6",  "4x100","35","54.1","SM", 6100, "/wheels/crystal.jpg"),
        v("15","6",  "4x100","38","54.1","BM", 7300, "/wheels/crystal.jpg"),
        v("15","6",  "4x100","38","54.1","SM", 7100, "/wheels/crystal.jpg"),
        v("16","7",  "5x114.3","38","67.1","BM", 8800, "/wheels/crystal.jpg"),
        v("16","7",  "5x114.3","38","67.1","SM", 8600, "/wheels/crystal.jpg"),
        v("17","7.5","5x114.3","38","67.1","BM",10400, "/wheels/crystal.jpg"),
        v("18","8",  "5x114.3","38","67.1","BM",12800, "/wheels/crystal.jpg"),
      ]
    },

    // ── DEFENDER ───────────────────────────────────────────────────────────
    {
      name: "Defender", handle: "neo-wheels-defender",
      desc: "Bold rugged wheel for compact SUVs. Available in Black & Silver Machined.",
      variants: [
        v("16","7","4x100","38","54.1","BM", 8700, "/wheels/defender.jpg"),
        v("16","7","4x100","38","54.1","SM", 8500, "/wheels/defender.jpg"),
        v("16","7","5x114.3","38","67.1","BM", 9200, "/wheels/defender.jpg"),
        v("16","7","5x114.3","38","67.1","SM", 9000, "/wheels/defender.jpg"),
      ]
    },

    // ── HYDRA ──────────────────────────────────────────────────────────────
    {
      name: "Hydra", handle: "neo-wheels-hydra",
      desc: "Multi-headed aggressive spoke design for SUVs and crossovers. Available 16\"–18\".",
      variants: [
        v("16","7","5x114.3","38","67.1","BM", 9500, "/wheels/hydra.jpg"),
        v("16","7","5x114.3","38","67.1","SM", 9200, "/wheels/hydra.jpg"),
        v("16","7","5x114.3","38","67.1","CB+M",9800, "/wheels/hydra.jpg"),
        v("18","8","5x114.3","38","67.1","BM",13500, "/wheels/hydra.jpg"),
        v("18","8","5x114.3","38","67.1","SM",13200, "/wheels/hydra.jpg"),
      ]
    },

    // ── MATRIX ─────────────────────────────────────────────────────────────
    {
      name: "Matrix", handle: "neo-wheels-matrix",
      desc: "The most versatile Neo Wheels design — available in the widest size range 12\" to 20\", fitting everything from Maruti Alto to Toyota Fortuner.",
      variants: [
        v("12","5","4x100","35","54.1","SM", 4500, "/wheels/matrix.jpg"),
        v("13","5.5","4x100","35","54.1","SM", 5300, "/wheels/matrix.jpg"),
        v("14","6","4x100","35","54.1","BM", 6100, "/wheels/matrix.jpg"),
        v("14","6","4x100","35","54.1","SM", 5900, "/wheels/matrix.jpg"),
        v("15","6","4x100","38","54.1","BM", 7100, "/wheels/matrix.jpg"),
        v("15","6","4x100","38","54.1","SM", 6900, "/wheels/matrix.jpg"),
        v("16","7","4x100","38","54.1","BM", 8200, "/wheels/matrix.jpg"),
        v("16","7","5x114.3","38","67.1","BM", 8800, "/wheels/matrix.jpg"),
        v("18","8","5x114.3","38","67.1","BM",12500, "/wheels/matrix.jpg"),
        v("20","9","5x114.3","38","67.1","BM",17000, "/wheels/matrix.jpg"),
      ]
    },

    // ── PHOENIX ────────────────────────────────────────────────────────────
    {
      name: "Phoenix", handle: "neo-wheels-phoenix",
      desc: "Rise above with the Phoenix — a sharp-spoke design for 12\" to 16\" fitment. Ideal for hatchbacks and small sedans.",
      variants: [
        v("12","5","4x100","35","54.1","SM", 4400, "/wheels/phoenix.png"),
        v("13","5.5","4x100","35","54.1","SM", 5200, "/wheels/phoenix.png"),
        v("13","5.5","4x100","35","54.1","BM", 5400, "/wheels/phoenix.png"),
        v("14","6","4x100","35","54.1","SM", 6100, "/wheels/phoenix.png"),
        v("14","6","4x100","35","54.1","BM", 6300, "/wheels/phoenix.png"),
        v("15","6","4x100","38","54.1","SM", 7100, "/wheels/phoenix.png"),
        v("15","6","4x100","38","54.1","BM", 7300, "/wheels/phoenix.png"),
        v("16","7","4x100","38","54.1","BM", 8300, "/wheels/phoenix.png"),
      ]
    },

    // ── RAYS ───────────────────────────────────────────────────────────────
    {
      name: "Rays", handle: "neo-wheels-rays",
      desc: "Multi-spoke rays design covering both 4x100 and 5x114.3 PCD. Fits hatchbacks to compact SUVs.",
      variants: [
        v("13","5.5","4x100","35","54.1","BM", 5100, "/wheels/rays.jpg"),
        v("13","5.5","4x100","35","54.1","SM", 4900, "/wheels/rays.jpg"),
        v("14","6","4x100","35","54.1","BM", 5900, "/wheels/rays.jpg"),
        v("14","6","4x100","35","54.1","SM", 5700, "/wheels/rays.jpg"),
        v("15","6","4x100","38","54.1","BM", 6900, "/wheels/rays.jpg"),
        v("15","6","4x100","38","54.1","SM", 6700, "/wheels/rays.jpg"),
        v("16","7","5x114.3","38","67.1","BM", 8500, "/wheels/rays.jpg"),
      ]
    },

    // ── RHINO ──────────────────────────────────────────────────────────────
    {
      name: "Rhino", handle: "neo-wheels-rhino",
      desc: "Thick tank-like spoke design built for off-road SUVs. Available in 16\" and 20\".",
      variants: [
        v("16","7","5x114.3","20","67.1","BM",10200, "/wheels/rhino.webp"),
        v("16","7","5x114.3","20","67.1","SM", 9800, "/wheels/rhino.webp"),
        v("20","9","5x114.3","20","67.1","BM",18500, "/wheels/rhino.webp"),
        v("20","9","5x114.3","20","67.1","SM",18000, "/wheels/rhino.webp"),
      ]
    },

    // ── ROYAL ──────────────────────────────────────────────────────────────
    {
      name: "Royal", handle: "neo-wheels-royal",
      desc: "Premium regal spoke design for hatchbacks and compact sedans. 14\"–15\" range.",
      variants: [
        v("14","6","4x100","35","54.1","BM", 6300, "/wheels/royal.jpg"),
        v("14","6","4x100","35","54.1","SM", 6100, "/wheels/royal.jpg"),
        v("15","6","4x100","38","54.1","BM", 7400, "/wheels/royal.jpg"),
        v("15","6","4x100","38","54.1","SM", 7100, "/wheels/royal.jpg"),
      ]
    },

    // ── RUBY ───────────────────────────────────────────────────────────────
    {
      name: "Ruby", handle: "neo-wheels-ruby",
      desc: "Gem-inspired multi-spoke wheel for 16\" compact SUV fitment.",
      variants: [
        v("16","7","4x100","38","54.1","BM", 8800, "/wheels/ruby.webp"),
        v("16","7","4x100","38","54.1","SM", 8600, "/wheels/ruby.webp"),
        v("16","7","5x114.3","38","67.1","BM", 9200, "/wheels/ruby.webp"),
      ]
    },

    // ── RYDER ──────────────────────────────────────────────────────────────
    {
      name: "Ryder", handle: "neo-wheels-ryder",
      desc: "Dynamic ryder-spoke design for hatchbacks and sedans. 14\"–16\" range.",
      variants: [
        v("14","6","4x100","35","54.1","BM", 6100, "/wheels/ryder.jpg"),
        v("14","6","4x100","35","54.1","SM", 5900, "/wheels/ryder.jpg"),
        v("15","6","4x100","38","54.1","BM", 7200, "/wheels/ryder.jpg"),
        v("15","6","4x100","38","54.1","SM", 7000, "/wheels/ryder.jpg"),
        v("16","7","4x100","38","54.1","BM", 8500, "/wheels/ryder.jpg"),
        v("16","7","5x114.3","38","67.1","SM", 8800, "/wheels/ryder.jpg"),
      ]
    },

    // ── PULSE ──────────────────────────────────────────────────────────────
    {
      name: "Pulse", handle: "neo-wheels-pulse",
      desc: "Energetic spoke design with a sporty flair. 16\"–17\" fitment range.",
      variants: [
        v("16","7","4x100","38","54.1","BM", 8700, "/wheels/pulse.jpg"),
        v("16","7","5x114.3","38","67.1","BM", 9200, "/wheels/pulse.jpg"),
        v("16","7","5x114.3","38","67.1","SM", 9000, "/wheels/pulse.jpg"),
        v("17","7.5","5x114.3","38","67.1","BM",10700, "/wheels/pulse.jpg"),
      ]
    },

    // ── DEFENDER ── already declared above, skip

    // ── SMART ──────────────────────────────────────────────────────────────
    {
      name: "Smart", handle: "neo-wheels-smart",
      desc: "Compact and smart multi-spoke design for small hatchbacks. Available 12\"–16\".",
      variants: [
        v("12","5","4x100","35","54.1","BM", 4300, "/wheels/smart.jpg"),
        v("12","5","4x100","35","54.1","SM", 4100, "/wheels/smart.jpg"),
        v("13","5.5","4x100","35","54.1","BM", 5100, "/wheels/smart.jpg"),
        v("13","5.5","4x100","35","54.1","SM", 4900, "/wheels/smart.jpg"),
        v("14","6","4x100","35","54.1","BM", 6000, "/wheels/smart.jpg"),
        v("16","7","4x100","38","54.1","BM", 8300, "/wheels/smart.jpg"),
      ]
    },

    // ── SPLIT ──────────────────────────────────────────────────────────────
    {
      name: "Split", handle: "neo-wheels-split",
      desc: "Split-spoke design for hatchbacks to compact SUVs. Available 14\"–16\".",
      variants: [
        v("14","6","4x100","35","54.1","BM", 6200, "/wheels/split.jpg"),
        v("14","6","4x100","35","54.1","SM", 6000, "/wheels/split.jpg"),
        v("15","6","4x100","38","54.1","BM", 7300, "/wheels/split.jpg"),
        v("15","6","4x100","38","54.1","SM", 7100, "/wheels/split.jpg"),
        v("16","7","5x114.3","38","67.1","BM", 8700, "/wheels/split.jpg"),
        v("16","7","5x114.3","38","67.1","SM", 8500, "/wheels/split.jpg"),
      ]
    },

    // ── TRANSFORMER ────────────────────────────────────────────────────────
    {
      name: "Transformer", handle: "neo-wheels-transformer",
      desc: "Transform your ride with this aggressive angular design. Available in 16\" for compact SUV fitment.",
      variants: [
        v("14","6","4x100","35","54.1","BM", 6400, "/wheels/transformer.jpg"),
        v("15","6","4x100","38","54.1","BM", 7500, "/wheels/transformer.jpg"),
        v("16","7","4x100","38","54.1","BM", 8800, "/wheels/transformer.jpg"),
        v("16","7","5x114.3","38","67.1","BM", 9300, "/wheels/transformer.jpg"),
      ]
    },

    // ── Poison ─────────────────────────────────────────────────────────────
    {
      name: "Poison", handle: "neo-wheels-poison",
      desc: "Deadly good looks with multi-spoke design for compact SUVs.",
      variants: [
        v("16","6.5","4x100","38","54.1","BM", 8600, "/wheels/defender.jpg"),
        v("16","6.5","4x100","38","54.1","SM", 8300, "/wheels/defender.jpg"),
        v("16","7","5x114.3","38","67.1","BM", 9100, "/wheels/defender.jpg"),
      ]
    },

    // misc models using closest available images
    {
      name: "Blade",    handle: "neo-wheels-blade",
      desc: "Sharp-edged blade spoke design. 15\" compact fitment.",
      variants: [ v("15","6","4x100","35","54.1","BM",7200, "/wheels/split.jpg") ]
    },
    {
      name: "Chocolate", handle: "neo-wheels-chocolate",
      desc: "Rich alloy design for compact hatchbacks.",
      variants: [ v("16","7","4x100","38","54.1","BM",8600, "/wheels/defender.jpg") ]
    },
    {
      name: "Destroyer", handle: "neo-wheels-destroyer",
      desc: "Heavy-duty destroyer spoke design for compact SUVs.",
      variants: [ v("16","7","5x114.3","38","67.1","BM",9200, "/wheels/thor-18-bm.jpg") ]
    },
    {
      name: "Fighter", handle: "neo-wheels-fighter",
      desc: "Fighter spoke design — aggressive and bold.",
      variants: [
        v("16","7","4x100","38","54.1","BM",8700, "/wheels/atlas.jpg"),
        v("16","7","5x114.3","38","67.1","BM",9200, "/wheels/atlas.jpg"),
      ]
    },
    {
      name: "Fire", handle: "neo-wheels-fire",
      desc: "Flame-inspired spoke design for compact hatchbacks.",
      variants: [ v("16","7","4x100","38","54.1","BM",8800, "/wheels/rays.jpg") ]
    },
    {
      name: "Glider", handle: "neo-wheels-glider",
      desc: "Smooth glider-spoke for compact SUVs.",
      variants: [ v("16","7","5x114.3","38","67.1","BM",9000, "/wheels/pulse.jpg") ]
    },
    {
      name: "GOAT", handle: "neo-wheels-goat",
      desc: "Greatest Of All Time wheel design for SUV owners.",
      variants: [ v("16","7","5x114.3","20","67.1","BM",10500, "/wheels/thor-18-bm.jpg") ]
    },
    {
      name: "Killer", handle: "neo-wheels-killer",
      desc: "Killer looks, precision machined alloy. 16\" fitment.",
      variants: [
        v("16","7","4x100","38","54.1","BM",8800, "/wheels/ryder.jpg"),
        v("16","7","5x114.3","38","67.1","BM",9300, "/wheels/ryder.jpg"),
      ]
    },
    {
      name: "KING", handle: "neo-wheels-king",
      desc: "Rule the road with the KING's regal multi-spoke design.",
      variants: [ v("16","7","5x114.3","38","67.1","BM",9800, "/wheels/royal.jpg") ]
    },
    {
      name: "Poison-X", handle: "neo-wheels-poison-x",
      desc: "Extreme variant of the Poison series for compact SUVs.",
      variants: [ v("16","7","5x114.3","38","67.1","BM",9500, "/wheels/defender.jpg") ]
    },
    {
      name: "Radar", handle: "neo-wheels-radar",
      desc: "Radar multi-spoke design for modern compact SUVs.",
      variants: [ v("16","7","5x114.3","38","67.1","BM",9000, "/wheels/surya-17-bm.jpg") ]
    },
    {
      name: "Rock", handle: "neo-wheels-rock",
      desc: "Rock-solid off-road design. 15\" fitment for smaller SUVs.",
      variants: [ v("15","6","5x114.3","38","67.1","BM",8000, "/wheels/rhino.webp") ]
    },
    {
      name: "Rugged", handle: "neo-wheels-rugged",
      desc: "Built for rugged terrain — compact SUV alloy.",
      variants: [
        v("16","7","5x114.3","20","67.1","BM",9500, "/wheels/rhino.webp"),
        v("16","7","5x114.3","20","67.1","SM",9200, "/wheels/rhino.webp"),
      ]
    },
    {
      name: "Shark", handle: "neo-wheels-shark",
      desc: "Predator of the road — sharp fin-spoke design.",
      variants: [ v("16","7","5x114.3","38","67.1","BM",9300, "/wheels/atlas.jpg") ]
    },
    {
      name: "SHASTRA", handle: "neo-wheels-shastra",
      desc: "Inspired by Indian artistry — bold multi-spoke wheel.",
      variants: [
        v("16","7","5x114.3","38","67.1","BM",9600, "/wheels/crystal.jpg"),
        v("16","7","5x114.3","38","67.1","SM",9300, "/wheels/crystal.jpg"),
      ]
    },
    {
      name: "Sling", handle: "neo-wheels-sling",
      desc: "Slingshot-inspired spoke design for hatchbacks and compact SUVs.",
      variants: [
        v("14","6","4x100","35","54.1","BM",6300, "/wheels/split.jpg"),
        v("14","6","4x100","35","54.1","SM",6100, "/wheels/split.jpg"),
        v("16","7","5x114.3","38","67.1","BM",8900, "/wheels/split.jpg"),
        v("16","7","5x114.3","38","67.1","SM",8700, "/wheels/split.jpg"),
      ]
    },
    {
      name: "SNAKE", handle: "neo-wheels-snake",
      desc: "Serpentine spoke pattern for an aggressive look on compact SUVs.",
      variants: [ v("16","7","5x114.3","38","67.1","BM",9400, "/wheels/hydra.jpg") ]
    },
    {
      name: "Sniper", handle: "neo-wheels-sniper",
      desc: "Precision engineered sniper-spoke design. 16\" compact SUV fitment.",
      variants: [ v("16","7","5x114.3","38","67.1","BM",9100, "/wheels/pulse.jpg") ]
    },
    {
      name: "Sport", handle: "neo-wheels-sport",
      desc: "Race-inspired sport spoke design for 15\" and 16\" fitment.",
      variants: [
        v("15","6.5","4x100","38","54.1","BM",7800, "/wheels/rays.jpg"),
        v("16","7","4x100","38","54.1","BM",8900, "/wheels/rays.jpg"),
      ]
    },
    {
      name: "Steam", handle: "neo-wheels-steam",
      desc: "Industrial steam-spoke inspired 16\" alloy for compact SUVs.",
      variants: [
        v("16","7","4x100","38","54.1","BM",8600, "/wheels/matrix.jpg"),
        v("16","7","5x114.3","38","67.1","SM",9000, "/wheels/matrix.jpg"),
      ]
    },
    {
      name: "Sync", handle: "neo-wheels-sync",
      desc: "Synchronized spoke design for a clean premium look on 15\"–16\" fitment.",
      variants: [
        v("15","6","4x100","38","54.1","BM",7300, "/wheels/oscar-15-sm.jpg"),
        v("16","7","4x100","38","54.1","BM",8500, "/wheels/oscar-15-sm.jpg"),
      ]
    },
  ]

  // ── 5. Create each model ─────────────────────────────────────────────────
  let success = 0, fail = 0
  for (const m of models) {
    try {
      const variants: any[] = []
      const seenImages = new Set<string>()
      const allImages: { url: string }[] = []

      for (const vnt of m.variants) {
        const rand = Math.random().toString(36).substring(2,5).toUpperCase()
        const sku = `NEO-${m.name.toUpperCase().replace(/[^A-Z0-9]/g,'')}-${vnt.size}x${vnt.width.replace('.','')}-${vnt.pcd.replace(/[^0-9x.]/g,'')}-${vnt.finish}-${rand}`
        variants.push({
          title: `${vnt.size}" / PCD ${vnt.pcd} / ${vnt.finishLabel}`,
          sku,
          manage_inventory: false,
          options: {
            "Size": `${vnt.size}"`,
            "Finish": vnt.finishLabel
          },
          metadata: {
            pcd: vnt.pcd,
            wheel_size: vnt.size,
            wheel_width: vnt.width,
            offset: vnt.offset,
            center_bore: vnt.bore,
            finish: vnt.finishLabel,
            variant_image: vnt.img
          },
          prices: [{ region_id: REGION_ID, amount: p(vnt.priceInr), currency_code: "inr" }]
        })
        if (!seenImages.has(vnt.img)) {
          seenImages.add(vnt.img)
          allImages.push({ url: vnt.img })
        }
      }

      const sizeVals   = [...new Set(variants.map(x => x.options["Size"]))]
      const finishVals = [...new Set(variants.map(x => x.options["Finish"]))]

      await createProductsWorkflow(container).run({
        input: {
          products: [{
            title: `Neo Wheels ${m.name}`,
            handle: m.handle,
            description: `${m.desc} Authorized Neo Wheels dealer — CarTunez, Hyderabad.`,
            status: ProductStatus.PUBLISHED,
            thumbnail: m.variants[0].img,
            images: allImages,
            category_ids: [categoryId],
            shipping_profile_id: SHIPPING_PROFILE_ID,
            sales_channels: [{ id: SALES_CHANNEL_ID }],
            options: [
              { title: "Size",   values: sizeVals },
              { title: "Finish", values: finishVals }
            ],
            variants
          }]
        }
      })
      success++
      logger.info(`  ✅ ${m.name} (${m.variants.length} variants)`)
    } catch (err) {
      fail++
      logger.error(`  ❌ ${m.name}: ${err.message}`)
    }
  }

  logger.info(`\n✅ Neo Wheels complete: ${success} created, ${fail} failed`)
}
