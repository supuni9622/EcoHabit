export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col">
      {/* Green header bar */}
      <header className="bg-green-600 text-white py-4 px-6 shadow-md">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <span className="text-3xl">🌿</span>
          <div>
            <h1 className="text-xl font-bold tracking-wide">EcoHabit</h1>
            <p className="text-green-100 text-xs">Live green, earn rewards</p>
          </div>
        </div>
      </header>

      {/* Centered card area */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="text-center py-4 text-xs text-green-700">
        © {new Date().getFullYear()} EcoHabit — Together for a greener planet
      </footer>
    </div>
  );
}
