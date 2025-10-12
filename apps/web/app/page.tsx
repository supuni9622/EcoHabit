import { Button } from '@ecohabit/ui';
import { Card } from '@ecohabit/ui';
import { PointsDisplay } from '@ecohabit/ui';
import { StreakCounter } from '@ecohabit/ui';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌱 EcoHabit
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your eco-friendly habits into an engaging journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>
            <div className="space-y-4">
              <PointsDisplay points={1250} />
              <StreakCounter streak={7} />
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Today's Actions</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🥤</span>
                <span>Recycled 3 plastic bottles</span>
                <span className="text-green-600 font-semibold">+30 pts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📄</span>
                <span>Recycled 5 paper items</span>
                <span className="text-green-600 font-semibold">+40 pts</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button className="w-full">
                Log New Habit
              </Button>
              <Button variant="outline" className="w-full">
                View Lessons
              </Button>
              <Button variant="outline" className="w-full">
                Join Challenge
              </Button>
            </div>
          </Card>
        </div>
        
        <div className="text-center">
          <p className="text-gray-500">
            Welcome to EcoHabit! Start your eco-friendly journey today.
          </p>
        </div>
      </div>
    </div>
  );
}
