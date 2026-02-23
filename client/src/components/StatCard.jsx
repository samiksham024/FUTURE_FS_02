// StatCard component for dashboard metrics
// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, icon: Icon, color, trend }) => {
    return (
        <div
            className="group p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
                    <div className="mt-2 flex items-baseline">
                        <span className="text-2xl font-bold dark:text-white">{value}</span>
                        {trend && (
                            <span className={`ml-2 text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {trend.value}
                            </span>
                        )}
                    </div>
                </div>
                <div className={`p-3 rounded-xl bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400 group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
