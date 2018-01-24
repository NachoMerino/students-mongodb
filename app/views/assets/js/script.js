$().ready(() => {
  const server = 'http://localhost:9090';
  $('main').css(('margin-top'), $('.navbar').outerHeight());

  $.ajax(`${server}/api/students`, {
      method: 'GET',
      contentType: 'application/json',
    })
    /* eslint-enable */
    .done((data) => {
      console.log(data);
      $('.table').append(`<thead class="thead-dark">
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">NAME</th>
                            <th scope="col">AGE</th>
                            <th scope="col">GENDER</th>
                            <th scope="col">ID</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                          </tr>
                        </thead>
                        <tbody>`);
      data.forEach((student, number) => {
        $('.table').append(` <tr id="${student._id}">
                              <th scope="row">${number}</th>
                              <td>${student.name}</td>
                              <td>${student.age}</td>
                              <td>${student.gender}</td>
                              <td>${student._id}</td>
                              <td><button data-id="${student._id}" type="button" class="btn btn-outline-primary editbtn">EDIT</button></td>
                              <td><button data-id="${student._id}" type="button" class="btn btn-outline-danger deletebtn">DELETE</button></td>
                            </tr>`);
      });
      // delete student
      $('.deletebtn').click((event) => {
        event.preventDefault();
        const { target } = event;
        const studentID = target.getAttribute('data-id');
        console.log('deleting', studentID);
        $.ajax(`${server}/api/delete/${studentID}`, {
            method: 'DELETE',
            contentType: 'application/json',
          })
          .done((data) => {
            console.log(data.message);
            $(`#${studentID}`).remove();
          })
          .fail((data) => { console.log('error') });
      });
      // edit student
      $('.editbtn').click((event) => {
        event.preventDefault();
        const { target } = event;
        const studentID = target.getAttribute('data-id');
        console.log('editing', studentID);
      });
    })
    .fail((data) => {
      console.log('error');
    });
  $('#searchStudent').click((event) => {
    event.preventDefault();
    const studentID = $('#studentID').val();
    $.ajax(`${server}/api/student/${studentID}`, {
        method: 'GET',
        contentType: 'application/json',
      })
      .done((data) => {
        $('.table')
          .empty()
          .append(`<thead class="thead-dark">
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">NAME</th>
                            <th scope="col">AGE</th>
                            <th scope="col">GENDER</th>
                            <th scope="col">ID</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                          </tr>
                        </thead>
                        <tbody>
                        <tr id="${data._id}">
                          <th scope="row">1</th>
                          <td>${data.name}</td>
                          <td>${data.age}</td>
                          <td>${data.gender}</td>
                          <td>${data._id}</td>
                          <td><button data-id="${data._id}" type="button" class="btn btn-outline-primary editbtn">EDIT</button></td>
                          <td><button data-id="${data._id}" type="button" class="btn btn-outline-danger deletebtn">DELETE</button></td>
                        </tr>`);
      })
      .fail((data) => { console.log('error') });
  });
});
