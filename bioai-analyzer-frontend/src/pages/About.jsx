import React from 'react';

function About() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
      {/* Project Overview Section */}
      <div className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark mb-4 sm:mb-6">About BioAI Analyzer</h1>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
          <h2 className="text-xl sm:text-2xl font-semibold text-dark mb-3 sm:mb-4">Project Overview</h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
            BioAI Analyzer is a modern web application designed to provide researchers and bioinformatics 
            professionals with powerful tools for biological sequence analysis. The platform enables users 
            to analyze DNA, RNA, and protein sequences through an intuitive interface, delivering comprehensive 
            results including GC content calculations, nucleotide frequency analysis, protein translations, 
            and open reading frame (ORF) detection.
          </p>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Built with cutting-edge web technologies and powered by industry-standard bioinformatics libraries, 
            BioAI Analyzer combines ease of use with scientific rigor. Users can input sequences manually or 
            upload FASTA and GenBank format files, visualize results through interactive charts, and maintain 
            a complete history of their analyses for future reference.
          </p>
        </div>
      </div>

      {/* Technology Stack Section */}
      <div className="mb-8 sm:mb-12">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
          <h2 className="text-xl sm:text-2xl font-semibold text-dark mb-3 sm:mb-4">Technology Stack</h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            BioAI Analyzer is built using modern, reliable technologies:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-base sm:text-lg font-semibold text-primary-600 mb-2">Frontend</h3>
              <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span><strong>React.js</strong> - Modern UI framework for building interactive interfaces</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span><strong>Tailwind CSS</strong> - Utility-first CSS framework for responsive design</span>
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-base sm:text-lg font-semibold text-primary-600 mb-2">Backend</h3>
              <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span><strong>FastAPI</strong> - High-performance Python web framework</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span><strong>Biopython</strong> - Comprehensive bioinformatics library</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Scientific Foundation Section */}
      <div className="mb-8 sm:mb-12">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
          <h2 className="text-xl sm:text-2xl font-semibold text-dark mb-3 sm:mb-4">Scientific Foundation</h2>
          <p className="text-sm sm:text-base text-gray-700 mb-4">
            The biological sequence analysis capabilities of BioAI Analyzer are powered by Biopython, 
            a widely-used and peer-reviewed bioinformatics library.
          </p>
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border-l-4 border-primary-500">
            <p className="text-xs sm:text-sm text-gray-600 mb-2 font-semibold">Citation:</p>
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
              Cock, P.J.A. et al. (2009). Biopython: freely available Python tools for computational 
              molecular biology and bioinformatics. <em>Bioinformatics</em>, 25(11), 1422–1423. 
              DOI: <a 
                href="https://doi.org/10.1093/bioinformatics/btp163" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline break-all"
              >
                10.1093/bioinformatics/btp163
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Capabilities Section */}
      <div>
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
          <h2 className="text-xl sm:text-2xl font-semibold text-dark mb-3 sm:mb-4">Key Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-primary-500 text-lg sm:text-xl mr-2 sm:mr-3">✓</span>
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-800">Multi-Format Support</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Analyze DNA, RNA, and protein sequences</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-primary-500 text-lg sm:text-xl mr-2 sm:mr-3">✓</span>
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-800">File Upload</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Support for FASTA and GenBank formats</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-primary-500 text-lg sm:text-xl mr-2 sm:mr-3">✓</span>
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-800">GC Content Analysis</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Precise calculation of GC percentage</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="text-primary-500 text-lg sm:text-xl mr-2 sm:mr-3">✓</span>
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-800">Interactive Visualizations</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Charts for nucleotide composition</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-primary-500 text-lg sm:text-xl mr-2 sm:mr-3">✓</span>
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-800">Analysis History</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Track and revisit previous analyses</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-primary-500 text-lg sm:text-xl mr-2 sm:mr-3">✓</span>
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-800">Secure Authentication</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Protected user accounts and data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
