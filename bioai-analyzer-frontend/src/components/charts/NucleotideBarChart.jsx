import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const NucleotideBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Transform data to format expected by Recharts
  const chartData = Object.entries(data).map(([nucleotide, count]) => ({
    nucleotide,
    count
  }));

  return (
    <div className="w-full h-64 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="nucleotide" 
            label={{ value: 'Nucleotide', position: 'insideBottom', offset: -5 }}
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
            style={{ fontSize: '12px' }}
          />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar 
            dataKey="count" 
            fill="#3b82f6" 
            name="Nucleotide Count"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NucleotideBarChart;
