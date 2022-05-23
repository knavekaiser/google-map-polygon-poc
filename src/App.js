import { useEffect, useState, useRef, useCallback } from "react";
import "./App.scss";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { Routes, Route, Link } from "react-router-dom";
import Map from "./Map";
import Dashboard from "./Dashboard";

function App() {
  const [plots, setPlots] = useState([
    {
      plotNo: 124,
      size: 370,
      facing: "north-east",
      status: "available",
      coordinates: [
        { lat: 23.715967, lng: 90.38026 },
        { lat: 23.715393, lng: 90.381177 },
        { lat: 23.714332, lng: 90.380448 },
        { lat: 23.714356, lng: 90.380147 },
        { lat: 23.714332, lng: 90.379922 },
        { lat: 23.714219, lng: 90.379697 },
        { lat: 23.714126, lng: 90.379595 },
        { lat: 23.714514, lng: 90.379037 },
      ],
    },
    {
      plotNo: 125,
      size: 400,
      facing: "south-east",
      status: "available",
      coordinates: [
        { lat: 23.715069, lng: 90.381671 },
        { lat: 23.714057, lng: 90.380914 },
        { lat: 23.713698, lng: 90.381059 },
        { lat: 23.713674, lng: 90.381166 },
        { lat: 23.713742, lng: 90.38137 },
        { lat: 23.713679, lng: 90.381789 },
        { lat: 23.71446, lng: 90.382513 },
      ],
    },
    {
      plotNo: 126,
      size: 375,
      facing: "south",
      status: "sold",
      coordinates: [
        { lat: 23.71359, lng: 90.378237 },
        { lat: 23.714342, lng: 90.378865 },
        { lat: 23.713914, lng: 90.37945 },
        { lat: 23.713693, lng: 90.379375 },
        { lat: 23.713384, lng: 90.379385 },
        { lat: 23.713168, lng: 90.379482 },
        { lat: 23.713045, lng: 90.379557 },
        { lat: 23.712868, lng: 90.379487 },
        { lat: 23.712935, lng: 90.379227 },
      ],
    },
    {
      plotNo: 127,
      size: 395,
      facing: "west",
      status: "sold",
      coordinates: [
        { lat: 23.712591, lng: 90.379464 },
        { lat: 23.71263, lng: 90.379808 },
        { lat: 23.712222, lng: 90.379872 },
        { lat: 23.71204, lng: 90.379808 },
        { lat: 23.711392, lng: 90.379878 },
        { lat: 23.711318, lng: 90.380028 },
        { lat: 23.711043, lng: 90.380012 },
        { lat: 23.710729, lng: 90.379711 },
        { lat: 23.711466, lng: 90.378585 },
      ],
    },
    {
      plotNo: 128,
      size: 150,
      facing: "north",
      status: "available",
      coordinates: [
        { lat: 23.713362, lng: 90.378075 },
        { lat: 23.7129, lng: 90.378831 },
        { lat: 23.712777, lng: 90.37873 },
        { lat: 23.712662, lng: 90.378697 },
        { lat: 23.712536, lng: 90.37874 },
        { lat: 23.712419, lng: 90.378815 },
        { lat: 23.711667, lng: 90.378209 },
        { lat: 23.71206, lng: 90.377641 },
        { lat: 23.713126, lng: 90.377533 },
      ],
    },
    {
      plotNo: 129,
      size: 250,
      facing: "west-south",
      status: "available",
      coordinates: [
        { lat: 23.712859, lng: 90.38066 },
        { lat: 23.713109, lng: 90.380912 },
        { lat: 23.713026, lng: 90.381776 },
        { lat: 23.712854, lng: 90.381991 },
        { lat: 23.712947, lng: 90.382077 },
        { lat: 23.712495, lng: 90.38272 },
        { lat: 23.71083, lng: 90.381309 },
        { lat: 23.71115, lng: 90.380907 },
        { lat: 23.711292, lng: 90.380993 },
        { lat: 23.712348, lng: 90.380827 },
        { lat: 23.712343, lng: 90.380757 },
      ],
    },
    {
      plotNo: 129,
      size: 250,
      facing: "west",
      status: "sold",
      coordinates: [
        { lat: 23.71319, lng: 90.382276 },
        { lat: 23.714216, lng: 90.383145 },
        { lat: 23.713769, lng: 90.383783 },
        { lat: 23.712753, lng: 90.382914 },
      ],
    },
  ]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Plots plots={plots} setPlots={setPlots} />} />
        <Route
          path="/dashboard/*"
          element={<Dashboard plots={plots} setPlots={setPlots} />}
        />
      </Routes>
    </div>
  );
}

const Plots = ({ plots }) => {
  const [selectedPlot, setSelectedPlot] = useState(null);

  return (
    <>
      <div>
        <h1>Map</h1>
        <Link to="/dashboard">Manage Plots</Link>
      </div>
      <Map
        zoom={17}
        minZoom={14}
        center={{
          lat: 23.713337,
          lng: 90.380914,
        }}
        style={{ height: "80vh", width: "90vw" }}
        plots={plots}
        onPlotClick={(e, plot) => {
          setSelectedPlot(plot);
        }}
        selectedPlot={selectedPlot}
        setSelectedPlot={setSelectedPlot}
        overlayImage="/master-plan.png"
        overlayTiles="/gtile"
      />
      {selectedPlot && <PlotDetail plot={selectedPlot} />}
    </>
  );
};

const PlotDetail = ({ plot }) => {
  return (
    <div className="plotDetail">
      <h4>Plot No: {plot.plotNo}</h4>
      <h4>Size: {plot.size}Sq.yds</h4>
      <h4>Facing: {plot.facing}</h4>
      <h4>Status: {plot.status}</h4>
    </div>
  );
};

export default App;
