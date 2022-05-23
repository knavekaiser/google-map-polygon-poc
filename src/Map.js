import { useRef, useState, useEffect, useCallback } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

const getPolyCoords = (polygon) => {
  const points = [];
  for (var i = 0; i < polygon.getLength(); i++) {
    const [lat, lng] = polygon
      .getAt(i)
      .toUrlValue()
      .split(",")
      .map((n) => +n);
    points.push({ lat, lng });
  }
  return points;
};

const Map = ({
  plots,
  onChange,
  onPlotClick,
  selectedPlot,
  setSelectedPlot,
  zoom,
  minZoom,
  center,
  draw,
  overlayImage,
  overlayTiles,
  edit,
  ...options
}) => {
  const ref = useRef(null);
  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);
  const visiblePlots = useRef([]);
  const selectedVisible = useRef(null);
  const [drawing, setDrawing] = useState();

  const updatePlots = useCallback(
    (e) => {
      visiblePlots.current.forEach((poly) => {
        poly.setMap(null);
      });
      selectedVisible.current?.setMap(null);
      const _visiblePlots = [];
      plots.forEach((plot) => {
        if (JSON.stringify(edit) === JSON.stringify(plot.coordinates)) {
          return;
        }
        const _plot = new window.google.maps.Polygon({
          geodesic: true,
          clickable: true,
          map: mapRef.current,
          strokeColor: "#000000",
          strokeWeight: 1,
          fillColor: draw
            ? "rgba(0, 0, 0, 0.4)"
            : plot.status === "available"
            ? "#00ff03"
            : "#e80341",
          fillOpacity: 0.5,
          paths: plot.coordinates,
          zIndex: 2,
        });
        if (onPlotClick) {
          window.google.maps.event.addListener(_plot, "click", (e) =>
            onPlotClick(e, plot)
          );
        }
        _visiblePlots.push(_plot);
      });
      visiblePlots.current = _visiblePlots;
    },
    [mapRef.current, plots]
  );

  useEffect(() => {
    const map = new window.google.maps.Map(ref.current, {
      center,
      zoom,
      minZoom,
      mapTypeId: "satellite",
      disableDefaultUI: true,
    });

    if (overlayImage) {
      const image = new window.google.maps.GroundOverlay(overlayImage, {
        north: 23.73078,
        south: 23.70638,
        east: 90.392842,
        west: 90.367125,
      });
      image.setMap(map);
    }

    if (overlayTiles) {
      var tiles = new window.google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
          return `${overlayTiles}/${zoom}/${coord.x}/${coord.y}.png`;
        },
        tileSize: new window.google.maps.Size(256, 256),
        isPng: true,
      });
      // map.overlayMapTypes.insertAt(0, tiles);
    }

    if (draw) {
      const drawingManger = new window.google.maps.drawing.DrawingManager({
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.Top_CENTER,
          drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
        },
        polygonOptions: {
          clickable: true,
          geodesic: true,
          editable: true,
          fillColor: "rgba(255, 122, 0, 0.64)",
          fillOpacity: 0.5,
          strokeWeight: 2,
        },
      });

      drawingManger.setMap(map);

      window.google.maps.event.addListener(
        drawingManger,
        "polygoncomplete",
        (e) => {
          setDrawing(e);
          onChange && onChange(getPolyCoords(e.getPath()));
          document.querySelector("button[title='Stop drawing']")?.click();

          window.google.maps.event.addListener(e, "click", (clickEvent) => {
            setDrawing(e);
            onChange && onChange(getPolyCoords(e.getPath()));
          });

          window.google.maps.event.addListener(
            e.getPath(),
            "insert_at",
            (e_i) => {
              // console.log("insert_at => ", getPolyCoords(e.getPath()));
              setDrawing(e);
              onChange && onChange(getPolyCoords(e.getPath()));
            }
          );

          window.google.maps.event.addListener(e.getPath(), "set_at", (e_i) => {
            // console.log("set_at => ", getPolyCoords(e.getPath()));
            setDrawing(e);
            onChange && onChange(getPolyCoords(e.getPath()));
          });
        }
      );

      drawingManagerRef.current = drawingManger;

      if (edit) {
        const editPlot = new window.google.maps.Polygon({
          clickable: true,
          geodesic: true,
          editable: true,
          fillColor: "rgba(255, 122, 0, 0.64)",
          fillOpacity: 0.5,
          strokeWeight: 2,
          paths: edit,
          zIndex: 10,
          map,
        });

        window.google.maps.event.addListener(
          editPlot.getPath(),
          "insert_at",
          (e_i) => {
            setDrawing(editPlot);
            onChange && onChange(getPolyCoords(editPlot.getPath()));
          }
        );

        window.google.maps.event.addListener(
          editPlot.getPath(),
          "set_at",
          (e_i) => {
            setDrawing(editPlot);
            onChange && onChange(getPolyCoords(editPlot.getPath()));
          }
        );

        setDrawing(editPlot);
      }
    }

    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (plots?.length > 0) {
      updatePlots();
    }
  }, [plots]);

  useEffect(() => {
    selectedVisible.current?.setMap(null);
    if (selectedPlot) {
      const _plot = new window.google.maps.Polygon({
        geodesic: true,
        clickable: true,
        map: mapRef.current,
        strokeColor: "#000000",
        strokeWeight: 1,
        fillColor: "#fcbd00",
        fillOpacity: 1,
        paths: selectedPlot.coordinates,
        zIndex: 5,
      });
      selectedVisible.current = _plot;
    }
  }, [selectedPlot]);

  useEffect(() => {
    if (drawingManagerRef.current && drawing) {
      drawingManagerRef.current.setOptions({
        drawingControlOptions: {
          drawingModes: [],
        },
      });
    } else {
      drawingManagerRef.current?.setOptions({
        drawingControlOptions: {
          drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
        },
      });
    }
  }, [drawingManagerRef.current, drawing]);

  return (
    <>
      {
        //   drawing && (
        //   <section>
        //     <button
        //       onClick={() => {
        //         console.log(getPolyCoords(drawing.getPath()));
        //       }}
        //     >
        //       Add Shape
        //     </button>
        //     <button>Clear shape</button>
        //   </section>
        // )
      }
      <div
        ref={ref}
        id="map"
        className={`${drawing ? "hideDrawIcon" : ""}`}
        {...options}
      />
    </>
  );
};

const CustomWrapper = (mapProps) => {
  const render = (status) => {
    switch (status) {
      case Status.LOADING:
        return <h1>Loading...</h1>;
      case Status.FAILURE:
        return <h1>Failed</h1>;
      case Status.SUCCESS:
        return <Map {...mapProps} />;
    }
  };

  return (
    <Wrapper
      apiKey={"AIzaSyDadAqPRsp8jBKFRLp6whQIQbobX6QrN1c"}
      render={render}
      libraries={["drawing"]}
    />
  );
};

export default CustomWrapper;

// export default Map;
