import NucleotideBarChart from '../charts/NucleotideBarChart';
import CompositionPieChart from '../charts/CompositionPieChart';

const ResultsDisplay = ({ results }) => {
  if (!results) {
    return null;
  }

  const { 
    gc_content, 
    protein_sequence, 
    nucleotide_counts, 
    orfs, 
    sequence_length,
    sequence_type 
  } = results;

  // Format GC content to 2 decimal places
  const formattedGC = gc_content ? parseFloat(gc_content).toFixed(2) : 'N/A';

  return (
    <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Analysis Results</h2>

      {/* Basic Statistics */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Sequence Type</p>
            <p className="text-base sm:text-lg font-medium text-gray-900">{sequence_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Sequence Length</p>
            <p className="text-base sm:text-lg font-medium text-gray-900">{sequence_length} bp</p>
          </div>
          {gc_content && (
            <div>
              <p className="text-sm text-gray-600">GC Content</p>
              <p className="text-base sm:text-lg font-medium text-gray-900">{formattedGC}%</p>
            </div>
          )}
        </div>
      </div>

      {/* Nucleotide Counts Table */}
      {nucleotide_counts && Object.keys(nucleotide_counts).length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Nucleotide Counts</h3>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nucleotide
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(nucleotide_counts).map(([nucleotide, count]) => (
                  <tr key={nucleotide}>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {nucleotide}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                      {count}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                      {((count / sequence_length) * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Protein Sequence */}
      {protein_sequence && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Protein Sequence</h3>
          <div className="bg-gray-50 p-3 sm:p-4 rounded border border-gray-200">
            <p className="font-mono text-xs sm:text-sm break-all text-gray-900">
              {protein_sequence}
            </p>
          </div>
        </div>
      )}

      {/* ORF Information */}
      {orfs && orfs.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Open Reading Frames (ORFs)</h3>
          <div className="space-y-4">
            {orfs.map((orf, index) => (
              <div key={index} className="border border-gray-200 rounded p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                  <div>
                    <span className="text-sm text-gray-600">Start: </span>
                    <span className="text-sm font-medium text-gray-900">{orf.start}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">End: </span>
                    <span className="text-sm font-medium text-gray-900">{orf.end}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Length: </span>
                    <span className="text-sm font-medium text-gray-900">{orf.end - orf.start} bp</span>
                  </div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <p className="font-mono text-xs break-all text-gray-900">
                    {orf.sequence}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visualizations */}
      {nucleotide_counts && Object.keys(nucleotide_counts).length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Nucleotide Distribution</h3>
            <NucleotideBarChart data={nucleotide_counts} />
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Composition</h3>
            <CompositionPieChart data={nucleotide_counts} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
