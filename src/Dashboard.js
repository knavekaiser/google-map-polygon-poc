import { useEffect, useState, useRef, useCallback, forwardRef } from "react";
import "./App.scss";
import { Routes, Route, Link } from "react-router-dom";
import Map from "./Map";
import { useForm } from "react-hook-form";

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

function Dashbaord({ plots, setPlots }) {
  const [addPlot, setAddPlot] = useState(false);
  const [edit, setEdit] = useState(null);
  return (
    <div className="dashbaord">
      <h2>Dashbaord</h2>
      <Link to="/">Home</Link>
      <button
        style={{ margin: "auto", marginLeft: 0 }}
        onClick={() => {
          setAddPlot(!addPlot);
          if (edit) setEdit(null);
        }}
      >
        {addPlot ? "Back" : "Add Plot"}
      </button>
      {addPlot ? (
        <Form
          edit={edit}
          onSuccess={(newPlot) => {
            setAddPlot(false);
            if (edit) {
              setPlots((prev) =>
                prev.map((plot) =>
                  plot.plotNo === newPlot.plotNo ? newPlot : plot
                )
              );
              setEdit(null);
            } else {
              setPlots((prev) => [newPlot, ...prev]);
            }
          }}
          plots={plots}
        />
      ) : (
        <div>
          <h3>List of plots</h3>
          <table>
            <thead>
              <tr>
                <th>Plot No.</th>
                <th>Size</th>
                <th>Facing</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {plots.map((plot, i) => (
                <tr key={i}>
                  <td>{plot.plotNo}</td>
                  <td>{plot.size}</td>
                  <td>{plot.facing}</td>
                  <td>{plot.status}</td>
                  <td>
                    <button
                      onClick={() => {
                        setEdit(plot);
                        setAddPlot(true);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const Input = forwardRef(({ label, error, ...rest }, ref) => {
  return (
    <section className={`input ${error ? "error" : ""}`}>
      <label>{label}</label>
      <input ref={ref} {...rest} />
      {error && <span className="errMsg">{error.message}</span>}
    </section>
  );
});

const Select = forwardRef(({ label, error, ...rest }, ref) => {
  return (
    <section className={`input ${error ? "error" : ""}`}>
      <label>{label}</label>
      <select ref={ref} {...rest}>
        <option value="available">Available</option>
        <option value="sold">Sold</option>
      </select>
      {error && <span className="errMsg">{error.message}</span>}
    </section>
  );
});

const Form = ({ edit, onSuccess, plots }) => {
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm();

  useEffect(() => {
    reset({ ...edit });
  }, [edit]);
  return (
    <form
      onSubmit={handleSubmit((values) => {
        onSuccess(values);
      })}
    >
      <h3>Add Plot</h3>
      <Input
        label="Plot No."
        {...register("plotNo", {
          required: "Field is required",
          validate: (value) => {
            if (!edit && plots.some(({ plotNo }) => +plotNo === +value)) {
              return "Plot Number already exists.";
            } else {
              return true;
            }
          },
        })}
        readOnly={edit}
        error={errors.plotNo}
        type="number"
      />

      <Input
        label="Size (Sq.yds)"
        {...register("size", { required: "Field is required" })}
        error={errors.size}
        type="number"
      />

      <Input
        label="Facing"
        {...register("facing", { required: "Field is required" })}
        error={errors.facing}
        type="text"
      />

      <Select
        label="Status"
        {...register("status", { required: "Field is required" })}
        options={[
          { label: "Available", value: "available" },
          { label: "Sold", value: "sold" },
        ]}
        error={errors.status}
      />

      <section
        style={
          errors.coordinates
            ? {
                border: "1px solid red",
              }
            : {}
        }
        {...register("coordinates", { required: "Please select coordinates" })}
      >
        <label>Coordinates</label>
        <Map
          zoom={14}
          minZoom={14}
          center={{
            lat: 23.713337,
            lng: 90.380914,
          }}
          style={{ height: "450px", width: "600px" }}
          overlayImage="/master-plan.png"
          overlayTiles="/gtile"
          draw
          onChange={(coordinates) => {
            setValue("coordinates", coordinates);
            clearErrors("coordinates");
          }}
          plots={plots}
          edit={edit?.coordinates}
          // selectedShape={selectedShape}
          // setSelectedShape={setSelectedShape}
        />
        {errors.coordinates && (
          <p style={{ color: "red" }}>{errors.coordinates.message}</p>
        )}
      </section>

      <button>Submit</button>
    </form>
  );
};

export default Dashbaord;
