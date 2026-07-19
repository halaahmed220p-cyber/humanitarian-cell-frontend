// ملف بيانات خريطة اليمن (GeoJSON)
const yemenGeo = {
  "type": "FeatureCollection",
  "features": [
    { "type": "Feature", "properties": { "name": "Taizz", "projects": 5 }, "geometry": { "type": "Polygon", "coordinates": [ [ [44.0, 13.5], [44.2, 13.5], [44.2, 13.7], [44.0, 13.7], [44.0, 13.5] ] ] } },
    { "type": "Feature", "properties": { "name": "Aden", "projects": 3 }, "geometry": { "type": "Polygon", "coordinates": [ [ [45.0, 12.7], [45.2, 12.7], [45.2, 12.9], [45.0, 12.9], [45.0, 12.7] ] ] } },
    { "type": "Feature", "properties": { "name": "Ibb", "projects": 7 }, "geometry": { "type": "Polygon", "coordinates": [ [ [44.1, 13.9], [44.3, 13.9], [44.3, 14.1], [44.1, 14.1], [44.1, 13.9] ] ] } }
    // يمكنكِ إضافة المزيد من المحافظات هنا بنفس الطريقة
  ]
};

export default yemenGeo;