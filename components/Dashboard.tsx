const ClimateControl = () => {
  const [studioTemperatures, setStudioTemperatures] = useState([21, 19, 22]);
  const [studioStatuses, setStudioStatuses] = useState(['Actief', 'Standby', 'Actief']);

  const updateTemperature = (studioIndex: number, temperature: number) => {
    setStudioTemperatures(prev => 
      prev.map((temp, index) => index === studioIndex ? temperature : temp)
    );
  };

  const toggleStudioStatus = (studioIndex: number) => {
    setStudioStatuses(prev => 
      prev.map((status, index) => 
        index === studioIndex 
          ? (status === 'Actief' ? 'Standby' : 'Actief')
          : status
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Thermometer className="w-5 h-5" />
          Klimaatbeheersing
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.studios.map((studio, index) => (
            <div key={studio.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">{studio.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  studioStatuses[index] === 'Actief' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {studioStatuses[index]}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Temperatuur</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="range" 
                      min="16" 
                      max="25" 
                      value={studioTemperatures[index]}
                      onChange={(e) => updateTemperature(index, parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="font-mono text-lg w-12">{studioTemperatures[index]}°C</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => toggleStudioStatus(index)}
                    className="btn btn-secondary text-sm"
                  >
                    {studioStatuses[index] === 'Actief' ? 'Standby' : 'Activeren'}
                  </button>
                  <button className="btn btn-secondary text-sm">
                    Schema
                  </button>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>Luchtvochtigheid: {52 + index}%</p>
                  <p>Ventilatie: {['Normaal', 'Laag', 'Hoog'][index]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rest van de ClimateControl component... */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Energiebeheer</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3">Huidig Verbruik</h4>
            <div className="text-3xl font-bold text-blue-600 mb-2">3.2 kW</div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Verwarming:</span>
                <span>1.8 kW</span>
              </div>
              <div className="flex justify-between">
                <span>Ventilatie:</span>
                <span>0.8 kW</span>
              </div>
              <div className="flex justify-between">
                <span>Verlichting:</span>
                <span>0.6 kW</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Maand Overzicht</h4>
            <div className="text-3xl font-bold text-green-600 mb-2">€187</div>
            <div className="text-sm text-gray-600">
              <p>Budget: €200/maand</p>
              <p className="text-green-600">€13 onder budget</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full" style={{width: '93.5%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
