import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, UserPlus, TrendingUp } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import TodoList from '../components/TodoList';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        total: 0,
        converted: 0,
        new: 0,
        conversionRate: 0
    });
    const [chartData, setChartData] = useState([]);
    const [sourceData, setSourceData] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/leads');
                const leads = res.data;

                const total = leads.length;
                const converted = leads.filter(l => l.status === 'Converted').length;
                const newLeads = leads.filter(l => l.status === 'New').length;
                const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : 0;

                setStats({ total, converted, new: newLeads, conversionRate });

                // Prepare chart data (Leads by Month for simplicity or Status distribution)
                // For this demo, let's show leads by status
                const statusCounts = leads.reduce((acc, lead) => {
                    acc[lead.status] = (acc[lead.status] || 0) + 1;
                    return acc;
                }, {});

                const data = Object.keys(statusCounts).map(status => ({
                    name: status,
                    count: statusCounts[status]
                }));

                setChartData(data);

                // Calculate Source Data for Pie Chart
                const sourceData = leads.reduce((acc, lead) => {
                    const source = lead.source || 'Unknown';
                    acc[source] = (acc[source] || 0) + 1;
                    return acc;
                }, {});

                const pData = Object.keys(sourceData).map(source => ({
                    name: source,
                    value: sourceData[source]
                }));
                setSourceData(pData);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
                <div className="text-right hidden sm:block">
                    <p className="text-2xl font-bold text-gray-800 dark:text-white font-mono">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Leads"
                    value={stats.total}
                    icon={Users}
                    color="blue"
                    trend={{ value: "+12%", isPositive: true }}
                />
                <StatCard
                    title="New Leads"
                    value={stats.new}
                    icon={UserPlus}
                    color="indigo"
                />
                <StatCard
                    title="Converted"
                    value={stats.converted}
                    icon={UserCheck}
                    color="green"
                    trend={{ value: "+5%", isPositive: true }}
                />
                <StatCard
                    title="Conversion Rate"
                    value={`${stats.conversionRate}%`}
                    icon={TrendingUp}
                    color="purple"
                    trend={{ value: "+2.4%", isPositive: true }}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold mb-4 dark:text-white">Lead Status Distribution</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>



                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold mb-4 dark:text-white">Leads by Source</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sourceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-1 h-full">
                    <TodoList />
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg lg:col-span-1 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold mb-2">Pro Tip</h2>
                        <p className="text-blue-100 mb-4">
                            Regularly following up with 'New' leads within 24 hours increases conversion rates by up to 60%.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/leads', { state: { status: 'New' } })}
                        className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors w-full sm:w-auto text-center"
                    >
                        View New Leads
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;
