import PropTypes from 'prop-types';

/**
 * Format timestamp to "YYYY-MM-DD HH:MM:SS" format
 * @param {string} timestamp - ISO 8601 timestamp
 * @returns {string} Formatted timestamp
 */
const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * HistoryItem component - displays a single analysis history record
 * @param {object} props
 * @param {object} props.analysis - History record object
 * @param {function} props.onViewDetails - Callback when "View Details" is clicked
 */
const HistoryItem = ({ analysis, onViewDetails }) => {
    // Get sequence preview (first 20 characters)
    const sequencePreview = analysis.input_sequence
        ? analysis.input_sequence.substring(0, 20) + (analysis.input_sequence.length > 20 ? '...' : '')
        : 'N/A';

    // Get sequence type from results
    const sequenceType = analysis.results?.sequence_type || 'Unknown';

    // Format timestamp
    const formattedTimestamp = formatTimestamp(analysis.created_at);

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 items-start md:items-center">
                {/* Sequence Type */}
                <div>
                    <p className="text-xs text-gray-500 uppercase mb-1">Type</p>
                    <span className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${sequenceType === 'DNA' ? 'bg-blue-100 text-blue-800' :
                            sequenceType === 'RNA' ? 'bg-green-100 text-green-800' :
                                sequenceType === 'Protein' ? 'bg-purple-100 text-purple-800' :
                                    'bg-gray-100 text-gray-800'
                        }`}>
                        {sequenceType}
                    </span>
                </div>

                {/* Sequence Preview */}
                <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 uppercase mb-1">Sequence Preview</p>
                    <p className="font-mono text-xs sm:text-sm text-gray-800 break-all">
                        {sequencePreview}
                    </p>
                </div>

                {/* Timestamp and Action */}
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row md:items-start lg:items-center md:justify-between gap-2">
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 uppercase mb-1">Date</p>
                        <p className="text-xs sm:text-sm text-gray-700">{formattedTimestamp}</p>
                    </div>

                    <button
                        onClick={() => onViewDetails(analysis)}
                        className="bg-primary-500 hover:bg-primary-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap w-full sm:w-auto"
                        aria-label={`View details for ${sequenceType} analysis from ${formattedTimestamp}`}
                    >
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

HistoryItem.propTypes = {
    analysis: PropTypes.shape({
        id: PropTypes.number.isRequired,
        user_id: PropTypes.number,
        input_sequence: PropTypes.string.isRequired,
        results: PropTypes.object,
        created_at: PropTypes.string.isRequired
    }).isRequired,
    onViewDetails: PropTypes.func.isRequired
};

export default HistoryItem;
