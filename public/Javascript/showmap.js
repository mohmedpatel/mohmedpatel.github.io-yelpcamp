mapboxgl.accessToken = MAPBOX;

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: idCamps.geometry.coordinates,
    zoom: 14,
  });
  

  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
    })
  );

  const nav = new mapboxgl.NavigationControl({
    visualizePitch: true,
    showCompass: true,
  });
  map.addControl(nav, "bottom-right");

  //  Set marker options.
  const marker = new mapboxgl.Marker({
    color: "red",
    draggable: true,
  })
    .setLngLat(idCamps.geometry.coordinates)
    .addTo(map);

    