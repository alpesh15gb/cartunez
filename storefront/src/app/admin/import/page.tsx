"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef } from "react"

// Sidebar Component
function AdminSidebar() {
    const pathname = usePathname()

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: "📊" },
        { label: "Products", href: "/admin/products", icon: "📦" },
        { label: "Orders", href: "/admin/orders", icon: "🛒" },
        { label: "Vehicles", href: "/admin/vehicles", icon: "🚗" },
        { label: "Fitments", href: "/admin/fitments", icon: "🔧" },
        { label: "Import", href: "/admin/import", icon: "📤" },
        { label: "Reports", href: "/admin/reports", icon: "📈" },
        { label: "Settings", href: "/admin/settings", icon: "⚙️" },
    ]

    return (
        <aside className="w-64 bg-black border-r border-white/10 p-4 flex flex-col min-h-screen">
            <Link href="/admin" className="flex items-center gap-3 px-3 py-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">CT</span>
                </div>
                <div>
                    <span className="text-white font-bold">Car Tunez</span>
                    <p className="text-white/40 text-xs">Admin Portal</p>
                </div>
            </Link>

            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                    ? "bg-orange-500/10 text-orange-500"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="border-t border-white/10 pt-4 mt-4">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white transition-colors">
                    <span className="text-xl">🌐</span>
                    <span className="font-medium">View Store</span>
                </Link>
            </div>
        </aside>
    )
}

// Import Type Card
function ImportTypeCard({
    icon,
    title,
    description,
    template,
    onImport,
    isActive,
    onClick
}: {
    icon: string
    title: string
    description: string
    template: string
    onImport: (file: File) => void
    isActive: boolean
    onClick: () => void
}) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    return (
        <div
            onClick={onClick}
            className={`card p-6 cursor-pointer transition-all ${isActive ? "border-orange-500 bg-orange-500/5" : "hover:border-white/20"
                }`}
        >
            <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center text-3xl">
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{title}</h3>
                    <p className="text-white/60 text-sm">{description}</p>
                    <a
                        href={template}
                        download
                        onClick={(e) => e.stopPropagation()}
                        className="text-orange-500 text-sm hover:text-orange-400 mt-2 inline-block"
                    >
                        Download Template →
                    </a>
                </div>
                {isActive && (
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function ImportPage() {
    const [selectedType, setSelectedType] = useState<"products" | "fitments" | "vehicles" | "inventory">("products")
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadResult, setUploadResult] = useState<{
        success: boolean
        message: string
        details?: { created: number; updated: number; errors: number }
    } | null>(null)
    const [previewData, setPreviewData] = useState<string[][] | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)

    const importTypes = [
        {
            id: "products" as const,
            icon: "📦",
            title: "Products",
            description: "Import products with name, SKU, price, description, category",
            template: "/templates/products-template.csv"
        },
        {
            id: "fitments" as const,
            icon: "🔧",
            title: "Fitments",
            description: "Map products to compatible vehicles (Make, Model, Variant)",
            template: "/templates/fitments-template.csv"
        },
        {
            id: "vehicles" as const,
            icon: "🚗",
            title: "Vehicles",
            description: "Import vehicle makes, models, and variants",
            template: "/templates/vehicles-template.csv"
        },
        {
            id: "inventory" as const,
            icon: "📊",
            title: "Inventory",
            description: "Bulk update stock quantities by SKU",
            template: "/templates/inventory-template.csv"
        },
    ]

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            setUploadResult(null)

            // Parse CSV for preview
            const reader = new FileReader()
            reader.onload = (event) => {
                const text = event.target?.result as string
                const rows = text.split("\n").slice(0, 6).map(row => row.split(","))
                setPreviewData(rows)
            }
            reader.readAsText(selectedFile)
        }
    }

    const handleImport = async () => {
        if (!file) return

        setIsUploading(true)
        setUploadResult(null)

        // Simulate upload
        await new Promise(resolve => setTimeout(resolve, 2000))

        setIsUploading(false)
        setUploadResult({
            success: true,
            message: `Successfully processed ${selectedType}`,
            details: {
                created: 45,
                updated: 12,
                errors: 3
            }
        })
    }

    const clearFile = () => {
        setFile(null)
        setPreviewData(null)
        setUploadResult(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />

            <main className="flex-1 overflow-auto">
                <header className="bg-black/50 border-b border-white/10 px-8 py-4 sticky top-0 z-10 backdrop-blur-xl">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Bulk Import</h1>
                        <p className="text-white/60 text-sm">Import products, fitments, vehicles, and inventory from CSV files</p>
                    </div>
                </header>

                <div className="p-8">
                    {/* Import Type Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {importTypes.map((type) => (
                            <ImportTypeCard
                                key={type.id}
                                icon={type.icon}
                                title={type.title}
                                description={type.description}
                                template={type.template}
                                onImport={() => { }}
                                isActive={selectedType === type.id}
                                onClick={() => setSelectedType(type.id)}
                            />
                        ))}
                    </div>

                    {/* File Upload Area */}
                    <div className="card p-8 mb-8">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            Upload {importTypes.find(t => t.id === selectedType)?.title} CSV
                        </h2>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {!file ? (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center cursor-pointer hover:border-orange-500/50 transition-colors"
                            >
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                                    📄
                                </div>
                                <p className="text-white font-medium mb-2">Drop your CSV file here or click to browse</p>
                                <p className="text-white/40 text-sm">Supports .csv files up to 10MB</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* File Info */}
                                <div className="flex items-center justify-between bg-white/5 rounded-xl p-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-2xl">
                                            📄
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{file.name}</p>
                                            <p className="text-white/40 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
                                        </div>
                                    </div>
                                    <button onClick={clearFile} className="text-red-500 hover:text-red-400 p-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Preview Table */}
                                {previewData && (
                                    <div className="overflow-x-auto">
                                        <p className="text-white/60 text-sm mb-2">Preview (first 5 rows):</p>
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-white/5">
                                                    {previewData[0]?.map((header, i) => (
                                                        <th key={i} className="py-2 px-3 text-left text-white/60 font-medium">
                                                            {header}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {previewData.slice(1).map((row, rowIndex) => (
                                                    <tr key={rowIndex} className="border-b border-white/5">
                                                        {row.map((cell, cellIndex) => (
                                                            <td key={cellIndex} className="py-2 px-3 text-white/80">
                                                                {cell}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Import Button */}
                                <button
                                    onClick={handleImport}
                                    disabled={isUploading}
                                    className="btn btn-primary w-full disabled:opacity-50"
                                >
                                    {isUploading ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                            Import {importTypes.find(t => t.id === selectedType)?.title}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Upload Result */}
                        {uploadResult && (
                            <div className={`mt-4 p-4 rounded-xl ${uploadResult.success
                                    ? "bg-green-500/10 border border-green-500/20"
                                    : "bg-red-500/10 border border-red-500/20"
                                }`}>
                                <div className="flex items-center gap-3 mb-2">
                                    {uploadResult.success ? (
                                        <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    <span className={`font-medium ${uploadResult.success ? "text-green-500" : "text-red-500"}`}>
                                        {uploadResult.message}
                                    </span>
                                </div>
                                {uploadResult.details && (
                                    <div className="flex gap-6 text-sm">
                                        <span className="text-green-500">✓ {uploadResult.details.created} created</span>
                                        <span className="text-blue-500">↻ {uploadResult.details.updated} updated</span>
                                        <span className="text-red-500">✗ {uploadResult.details.errors} errors</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Recent Imports */}
                    <div className="card overflow-hidden">
                        <div className="p-4 border-b border-white/10">
                            <h2 className="text-lg font-semibold text-white">Recent Imports</h2>
                        </div>
                        <table className="w-full">
                            <thead className="bg-white/[0.02]">
                                <tr className="text-left text-white/40 text-sm">
                                    <th className="py-3 px-4 font-medium">File</th>
                                    <th className="py-3 px-4 font-medium">Type</th>
                                    <th className="py-3 px-4 font-medium">Records</th>
                                    <th className="py-3 px-4 font-medium">Status</th>
                                    <th className="py-3 px-4 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-white/5">
                                    <td className="py-3 px-4 text-white">products_jan21.csv</td>
                                    <td className="py-3 px-4 text-white/60">Products</td>
                                    <td className="py-3 px-4 text-white">156</td>
                                    <td className="py-3 px-4">
                                        <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-sm">Complete</span>
                                    </td>
                                    <td className="py-3 px-4 text-white/60">Jan 21, 2026</td>
                                </tr>
                                <tr className="border-b border-white/5">
                                    <td className="py-3 px-4 text-white">fitments_batch2.csv</td>
                                    <td className="py-3 px-4 text-white/60">Fitments</td>
                                    <td className="py-3 px-4 text-white">89</td>
                                    <td className="py-3 px-4">
                                        <span className="bg-green-500/10 text-green-500 px-2 py-1 rounded text-sm">Complete</span>
                                    </td>
                                    <td className="py-3 px-4 text-white/60">Jan 20, 2026</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}
