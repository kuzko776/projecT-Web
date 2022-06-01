export function convertTimeTableFromFirebase(timetable) {
  const newList = [];
  timetable.forEach((element) => {
    newList.push(convertFromFirebase(element));
  });
  return newList;
}

export function convertFromFirebase(element) {
  return Object.assign({}, element, {
    tempId: element.id,
    title: element.name,
    rRule: "FREQ=WEEKLY",
    startDate: element.startDate.toDate(),
    endDate: element.endDate.toDate(),
  });
  // element.title = element.name;
  // element.rRule = "FREQ=WEEKLY";
  // element.startDate = element.startDate.toDate()
  // element.endDate = element.endDate.toDate()

  // console.log(element);
  //delete element.name
}

export function convertTimeTableToFirebase(timetable) {
  const newList = timetable.concat();
  newList.forEach((element) => {
    convertToFirebase(element);
  });
  return newList;
}

export function convertToFirebase(e) {
  let newElement = Object.assign(
    {},
    {
      subjectId: e.subjectId,
      name: e.name,
      teacherId: e.teacherId,
      teacherName: e.teacherName,
      semester: e.semester,
      startDate: e.startDate,
      endDate: e.endDate,
      hall: e.hall,
      lab: e.lab ?? false,
      labGroup: e.labGroup ?? "",
    }
  );
  return newElement;
}

export function createSemesterList(depList) {
  let dataArray = [];
  depList.forEach((dep) => {
    for (var i = 1; i <= dep.semesters; i++) {
      dataArray.push({
        depId: dep.id,
        depName: dep.name,
        number: i,
      });
    }
  });
  return dataArray;
}

export function convertLeacturesFromFirebase(list){
list.map((item)=>{
  item.title = item.name
})
}