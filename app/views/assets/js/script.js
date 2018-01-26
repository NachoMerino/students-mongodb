$().ready(() => {
  const server = 'http://localhost:3000';

  $('main').css(('margin-top'), $('.navbar').outerHeight());

  // all functions
  function renderSubjects(subjectsArray, button) {
    let subjects = '';
    // show subjects as a button or no
    if (button) {
      subjectsArray.forEach((subject) => {
        subjects += `<button type = "button" class = "btn btn-outline-info" >${subject}</button>   `;
      });
      return subjects;
    } else {
      subjectsArray.forEach((subject, index) => {
        if (index !== subjectsArray.length - 1) {
          subjects += `${subject},`;
        } else {
          subjects += `${subject}`;
        }
      });
      return subjects;
    }
  }

  const mkThead = `<thead class="thead-dark">
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">NAME</th>
                            <th scope="col">AGE</th>
                            <th scope="col">GENDER</th>
                            <th scope="col">ID</th>
                            <th scope="col">SUBJECTS</th>
                            <th scope="col"></th>
                          </tr>
                        </thead>
                        <tbody>`;

  function mkTbody(student, index) {
    return $(`<tr id="${student._id}">
                <th scope="row">${index}</th>
                <td>${student.name}</td>
                <td>${student.age}</td>
                <td>${student.gender}</td>
                <td>${student._id}</td>
                <td>${renderSubjects(student.subjects, 'button')}</td>
                <td><button id="${student._id}" type="button" class="btn btn-outline-primary editbtn" data-toggle="modal" data-target="#studentmodal">EDIT</button>   <button id="${student._id}" type="button" class="btn btn-outline-danger deletebtn">DELETE</button></td>
              </tr>`);
  }

  function mkModalBody(tittle) {
    $('.modal-content').empty().append(`
              <div class="modal-header">
          <h5 class="modal-title" id="studentForm">${tittle} STUDENT</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <input type="text" id="name" class="form-control" placeholder="Name" required>
            <input type="number" id="age" class="form-control" placeholder="Age" required>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="inlineRadioOptions" id="male" value="male" checked="checked">
              <label class="form-check-label" for="male">Male</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" name="inlineRadioOptions" id="female" value="female">
              <label class="form-check-label" for="female">Female</label>
            </div>
            <input type="text" id="street" class="form-control" placeholder="Street" required>
            <input type="text" id="city" class="form-control" placeholder="City" required>
            <input type="text" id="postal" class="form-control" placeholder="Postal" required>
            <input type="text" id="subjects" class="form-control" placeholder="subjects" required>
            <div class="form-group row">
              <div class="col-sm-10 form-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary">Save</button>
              </div>
            </div>
          </form>
          <div class="modal-footer">
          </div>
        </div>`);
  }

  function loadFreshData() {
    $.ajax(`${server}/api/students`, {
        method: 'GET',
        contentType: 'application/json',
      })
      .done((data) => {
        $('.table').empty().append(mkThead);
        data.forEach((student, index) => {
          $('.table').append(mkTbody(student, index));
        });
      })
      .fail((data) => {
        console.log('error');
      });
  }

  // delete student
  function deleteStudent(id) {
    $.ajax(`${server}/api/student/${id}`, {
        method: 'DELETE',
        contentType: 'application/json',
      })
      .done((data) => {
        loadFreshData(server);
        console.log(data.message);
      })
      .fail((data) => {
        console.log('error from server');
      });
  }

  function fillModalEdit(studentId) {
    $('.form-footer button:nth-child(2)').attr('id', studentId).addClass('save');
    $.ajax(`${server}/api/student/${studentId}`, {
        method: 'GET',
        contentType: 'application/json',
      })
      .done((data) => {
        $('#name').val(data.name);
        $('#age').val(data.age);
        $('#street').val(data.address.street);
        $('#city').val(data.address.city);
        $('#postal').val(data.address.postal);
        $('#subjects').val(renderSubjects(data.subjects));
      })
      .fail((data) => {
        console.log('error');
      });
  }

  function createEditStudent(method, studentId) {
    let ajaxCall = `${server}/api/student/${studentId}`;
    if (!studentId) {
      ajaxCall = `${server}/api/student`;

    }
    const name = $('#name').val();
    const age = $('#age').val();
    const street = $('#street').val();
    const city = $('#city').val();
    const gender = $('.form-check-input').val();
    const postal = $('#postal').val();
    const subjects = $('#subjects').val().split(',');
    //  control if the fields are empty
    if ((name && age && street && city && postal && gender && subjects) === '') {
      console.log('meeeekkk');
      return $('.modal-footer').empty().append(`<div class="alert alert-danger" role="alert">
                      All field must be filled!
                    </div>`);
    } else {
      $.ajax(ajaxCall, {
          method: method,
          contentType: 'application/json',
          data: JSON.stringify({
            name: name,
            age: age,
            gender: gender,
            street: street,
            postal: postal,
            city: city,
            subjects: subjects
          }),
        })
        .done((data) => {
          console.log(data.message);
          $('.modal').modal('toggle');
          loadFreshData(server);
        })
        .fail((data) => {
          console.log(data.err);
        });
    }
  }

  // search one student by id
  function findStudent() {
    const studentId = $('#studentId').val();
    $.ajax(`${server}/api/student/${studentId}`, {
        method: 'GET',
        contentType: 'application/json',
      })
      .done((data) => {
        $('.table')
          .empty()
          .append(mkThead)
          .append(mkTbody(data, 0));
      })
      .fail((data) => {
        console.log('error')
      });
  }
  //Web start
  // load students list
  loadFreshData(server);
  // click event with CONTROL FLOW
  $('body').click((event) => {
    event.preventDefault();
    const { target } = event;
    const clickId = target.getAttribute('id');
    if (clickId !== null) {
      const clickClass = target.getAttribute('class');
      if (clickClass.match('editbtn')) {
        mkModalBody('EDIT');
        fillModalEdit(clickId);
      } else if (clickClass.match('deletebtn')) {
        deleteStudent(clickId);
      } else if (clickId.match('createStudent')) {
        mkModalBody('CREATE');
        $('.form-footer button:nth-child(2)').attr('id', 'create');
      } else if (clickId.match('searchStudent')) {
        findStudent();
      } else if (clickId.match('showStudents')) {
        loadFreshData(server);
      } else if (clickClass.match('save')) {
        createEditStudent('PUT', clickId);
      } else if (clickId.match('create')) {
        createEditStudent('POST');
      }
    }
  });
});
