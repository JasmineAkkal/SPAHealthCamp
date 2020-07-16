$(document).ready(function() {
	$("#demoTab").addClass("lightBlue");
	$("#vitalTab").addClass("darkBlue");
	$("#reportTab").addClass("darkBlue");
	$("#tabDiv").addClass("darkBlue");
		$('.nav-tabs > li > a').click(function(event){
		event.preventDefault();//stop browser to take action for clicked anchor
					
		//get displaying tab content jQuery selector
		var active_tab_selector = $('.nav-tabs > li.active > a').attr('href');					
					
		//find actived navigation and remove 'active' css
		var actived_nav = $('.nav-tabs > li.active');
		actived_nav.removeClass('active');
					
		//add 'active' css into clicked navigation
		$(this).parents('li').addClass('active');
					
		//hide displaying tab content
		$(active_tab_selector).removeClass('active');
		$(active_tab_selector).addClass('hide');
					
		//show target tab content
		var target_tab_selector = $(this).attr('href');
		$(target_tab_selector).removeClass('hide');
		$(target_tab_selector).addClass('active');
	     });
	  });

	  
function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#photo')
                    .attr('src', e.target.result)
                    .width(150)
                    .height(200);
            };

            reader.readAsDataURL(input.files[0]);
        }
    }
// Database reference
var db = null;
sessionStorage.setItem('count', 0);
//var count = 0;
// Creates a connection to the local database
connectToDB = function()
{
   db = window.openDatabase('healthDb', '1.0',
                                   'healthDb Database', 1024*1024*3);
};

dropTable = function(id){
  db.transaction(function(tx) {
    tx.executeSql('DROP TABLE demographics', [],
      function(SQLTransaction, data){
      //alert('Table Deleted')
      });
  });
}
dropTableVitals = function(id){
  db.transaction(function(tx) {
    tx.executeSql('DROP TABLE vitals', [],
      function(SQLTransaction, data){
      //alert('Table Deleted')
      });
  });
}
createDemographicsTable = function()
{
  db.transaction(function(tx){
    tx.executeSql(
      "CREATE TABLE demographics (firstname TEXT, lastname TEXT, gender TEXT, age INT, notes_of_other_details TEXT, Image_src TEXT, User_ID INT)", [],
      function(){ //alert('demographics database created successfully!');
	  },
      function(tx, error){ alert(error.message);} );
  });
  
};


//Create the table method
createVitalsTable = function()
{
  db.transaction(function(tx){//FOREIGN KEY(trackartist) REFERENCES artist(artistid)
    tx.executeSql(
      "CREATE TABLE vitals (height INT, weight INT, body_Temprature INT, pulse_rate INT, bp INT,medications TEXT, extra_notes TEXT, User_ID)", [],
      function(){ //alert('vitals database created successfully!'); 
	  },
      function(tx, error){ alert(error.message); } );
  });
};

//Insert record into Table.
insertDemo = function(firstname, lastname, gender, age, notes_of_other_details, Image_src)
{
	count =  parseInt(sessionStorage.getItem('count'));
	count = count+1;
	sessionStorage.setItem('count',count);
   db.transaction(function(tx){
      tx.executeSql("INSERT INTO demographics (firstname, lastname, gender, age, notes_of_other_details, Image_src, User_ID) VALUES (?, ?, ?, ?, ?, ?, ?)", 
                     [firstname.val(), lastname.val(), gender.val(), age.val(), notes_of_other_details.val(), Image_src, count],
        function(tx, result){ 
         var id = result.insertId ;  		 
		 //alert('Record ' + id+ ' saved!');
         firstname.attr("data-id", result.insertId );
         addToNotesList(id, firstname.val());
         $("#delete_button").show();
        },
        function(){ 
          alert('The demographics could not be saved.'); 
        }
      );
   });
   /*db.transaction(function(tx){
      tx.executeSql("INSERT INTO demographics (User_ID) VALUES (?)", 
                     [count],
        function(tx, result){ 
         var id = result.insertId ;
         alert('Record ' + id+ ' saved!');
        },
        function(){ 
          alert('The demographics could not be saved.'); 
        }
      );
   });*/
   
};


insertHealthVitals = function(height, weight, body_Temprature, pulse_rate, bp, medications, extra_notes)
{
   count = parseInt(sessionStorage.getItem('count'));
   db.transaction(function(tx){
      tx.executeSql("INSERT INTO vitals (height, weight, body_Temprature, pulse_rate, bp, medications, extra_notes, User_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
                     [height.val(), weight.val(), body_Temprature.val(), pulse_rate.val(), bp.val(), medications.val(), extra_notes.val(), count],
        function(tx, result){ 
         var id = result.insertId ;
         //alert('Record ' + id+ ' saved!');
         height.attr("data-id", result.insertId );
         addToNotesList(id, height.val());
         $("#delete_button").show();
        },
        function(){ 
          alert('The health vitals could not be saved.'); 
        }
      );
   });
};

/* update record into Table. Takes the Title field and Note field
   which are both jQuery objects. The id to update is a custom data attribute on the title field.
*/

updateNote = function(title, demographics)
{
   var id = title.attr("data-id");
   db.transaction(function(tx){
    tx.executeSql("UPDATE demographics set title = ?, note = ? where id = ?",
                  [title.val(), note.val(), id],
      function(tx, result){ 
       // alert('Record ' + id + ' updated!');
        $("#demographics>li[data-id=" + id + "]").html(title.val());
      },
      function(){ 
        alert('The demographics was not updated!');
      }
    );
  });
};


//remove record from Table.
deleteNote = function(title)
{
   var id = title.attr("data-id");
   db.transaction(function(tx){
      tx.executeSql("DELETE from demographics where id = ?", [id],
        function(tx, result){ 
         alert('Record ' + id + ' deleted!');
         $("#demographics>li[data-id=" + id + "]").remove();
        },
        function(){ 
         alert('The demographics was not deleted!');
        }
      );
   });
};


// loads all records from the notes table of the database;
fetchPatientDetails = function(){
  db.transaction(function(tx) {
      tx.executeSql('SELECT demographics.firstname, demographics.age, demographics.gender, demographics.Image_src, vitals.medications, vitals.extra_notes FROM demographics INNER JOIN vitals ON vitals.rowid = demographics.rowid', [],
        function(SQLTransaction, data){
          // document.getElementById("tblGrid").innerHTML = '';  
                    $("#patientDetails").find("tr:gt(0)").remove();  
                    var str = '';  
                    for (var i = 0; i < data.rows.length; ++i) {
						var row = data.rows.item(i);
						
                        str += "<tr style="+'border-bottom: solid 1px;'+">";  
                        str += "<td>" + row['firstname'] + "</td>";  
                        str += "<td>" + row['age'] + "</td>";  
                        str += "<td>" + row['gender'] + "</td>";  
                        str += "<td><img src=" +row['Image_src'] + " /> </td>"; 
						str += "<td>" + row['medications'] + "</td>"; 
						str += "<td>" + row['extra_notes'] + "</td>"; 						
                        str += "</tr>";  
                        document.getElementById("patientDetails").innerHTML += str;  
                        str = '';  
                    }  
/*for (var i = 0; i < data.rows.length; ++i) {
              var row = data.rows.item(i);
              var firstname = row['firstname'];
              var age = row['age'];
			  var gender = row['gender'];
			  var Image_src = row['Image_src'];
			  var medications = row['medications'];
			  var extra_notes = row['extra_notes'];
			  console.log(firstname);
              //addToNotesList(id, title);
          }*/
      });
  });
};

// Adds the list item to the list of demographics, given an id and a title.
addToNotesList = function(id, title){
  var demographics = $("#demographics");
  var item = $("<li>");
  item.attr("data-id", id);
  item.html(title);               
  demographics.append(item);
};


// loads a single note from the notes table using the given id
loadNote = function(id){
  db.transaction(function(tx) {
    tx.executeSql('SELECT id, title, note FROM notes where id = ?', [id],
      function(SQLTransaction, data){
        var row = data.rows.item(0);
        var title = $("#title");
        var note = $("#note");
        title.val(row["title"]);
        title.attr("data-id", row["id"]);
        note.val(row["note"]);
        $("#delete_button").show();
      });
  });
}



// Clears out the form and removes the "delete" button
newNote = function(){
  $("#delete_button").hide();
  var title = $("#title");
  title.removeAttr("data-id");
  title.val("");
  var note = $("#note");
  note.val("");
}


$(function(){
  connectToDB();
  //dropTable();
  //dropTableVitals();
  createDemographicsTable();
  createVitalsTable();
  
 
  //$.post('http://localhost:8080/reports');
  //fetchPatientDetails();
   var width = 320;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  var streaming = false;

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;
  
  
  $("#save_button").click(function(event){
    event.preventDefault();
    var firstname = $("#firstname");
	var age = $("#age");
    var lastname = $("#lastname");
	var gender = $("#gender");
	var width = 120;
	var height = 120;
    var notes_of_other_details = $("#notes_of_other_details");
	//console.log($("#canvas"));
	var canvas = $("#canvas");
	var dataURL = canvas[0].toDataURL("image/png");
	//console.log($("#video"));
	//var Image_src = $("#video")[0].src;
	/*if($("#canvas")[0].height>120){
		$("#canvas")[0].height = height;
	}
	if($("#canvas")[0].width>120){
		$("#canvas")[0].width = width;
	}*/
	//$("#video")
	//context.clearRect(0, 0, canvas.width, canvas.height);
	$("#demoTab").removeClass("lightBlue").addClass("darkBlue");
	//$("#tabDiv").removeClass("lightBlue").addClass("darkBlue");
	//$("#reportTab").removeClass("lightBlue").addClass("darkBlue");
	$("#vitalTab").removeClass("darkBlue").addClass("lightBlue");
	
	document.getElementById("demoDiv").style.display = "none";
	document.getElementById("vitalDiv").style.display = "block";
	document.getElementById("reportDiv").style.display = "none";
	$(function(){fetchPatientDetails();});
//var Image_src = "";
   /* if(title.attr("data-id")){
      updateNote(title, note);
    }else{*/
	
      insertDemo(firstname, lastname, age, gender, notes_of_other_details, dataURL);
    //}
  });
  
  $("#save_buttonVitals").click(function(event){
    event.preventDefault();
	var height = $("#height");
    var weight = $("#weight");
	var body_Temprature = $("#body_Temprature");
    var pulse_rate = $("#pulse_rate");
	var bp = $("#bp");
	var medications = $("#medications");
    var extra_notes = $("#extra_notes");
   /* if(title.attr("data-id")){
      updateNote(title, note);
    }else{*/
		$("#vitalTab").removeClass("lightBlue").addClass("darkBlue");
	//$("#tabDiv").removeClass("lightBlue").addClass("darkBlue");
	//$("#reportTab").removeClass("lightBlue").addClass("darkBlue");
	$("#reportTab").removeClass("darkBlue").addClass("lightBlue");
	document.getElementById("demoDiv").style.display = "none";
	document.getElementById("vitalDiv").style.display = "none";
	document.getElementById("reportDiv").style.display = "block";
	$(function(){fetchPatientDetails();});
      insertHealthVitals(height, weight, body_Temprature, pulse_rate, bp, medications, extra_notes);
    //}
  });

  
  $("#delete_button").click(function(event){
    event.preventDefault();
    var title = $("#title");
    deleteNote(title);
  });
  /*
  $("#vitalTab").click(function(event){
    document.getElementById("demoDiv").style.display = "none";
	document.getElementById("vitalDiv").style.display = "block";
	document.getElementById("reportDiv").style.display = "none";
  });
  */
  $("#demoTab").click(function(event){
	$("#vitalTab").removeClass("lightBlue").addClass("darkBlue");
	$("#demoTab").removeClass("darkBlue").addClass("lightBlue");
	$("#reportTab").removeClass("lightBlue").addClass("darkBlue");
    document.getElementById("demoDiv").style.display = "block";
	document.getElementById("vitalDiv").style.display = "none";
	document.getElementById("reportDiv").style.display = "none";
  });
  $("#reportTab").click(function(event){
	$("#vitalTab").removeClass("lightBlue").addClass("darkBlue");
	$("#demoTab").removeClass("lightBlue").addClass("darkBlue");
	$("#reportTab").removeClass("darkBlue").addClass("lightBlue");
    document.getElementById("demoDiv").style.display = "none";
	document.getElementById("vitalDiv").style.display = "none";
	document.getElementById("reportDiv").style.display = "block";
  });
  $("#notes").click(function(event){
    if ($(event.target).is('li')) {
      var element = $(event.target);
      loadNote(element.attr("data-id"));
    }
  });
  $("#capture").click(function(event){

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "trialWebcam.js."; 
    document.getElementsByTagName("head")[0].appendChild(script);
    return false;

});
  $("#new_button").click(function(event){
    event.preventDefault();
    newNote();
  });
  $('.nav-tabs').on('show.bs.tab', 'a', function(event) {
    event.preventDefault();
});
$('.nav-tabs').on('hide.bs.tab', 'a', function(event) {
    event.preventDefault();
});
  
  newNote();  
  
});

