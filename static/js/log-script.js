let cpuChart, memChart; // Variables to store the chart instances
let countdownInterval; // Variable to store the countdown interval

$(document).ready(function () {
    // Function to toggle Dark Mode
    $(".dark-mode-toggle").on("click", function () {
        $("body").toggleClass("dark-mode");
        // Save the user's Dark Mode preference in local storage
        const isDarkMode = $("body").hasClass("dark-mode");
        localStorage.setItem("darkMode", isDarkMode);
    });

    // Check for the user's Dark Mode preference in local storage
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    $("body").toggleClass("dark-mode", isDarkMode);

    updateData();
    setInterval(updateData, 5000);
});

function createChart(chartElement, data) {
    let backgroundColor;
    if (data > 80) {
        backgroundColor = '#f04e4e'; // Red color for values above 80
    } else if (data > 40) {
        backgroundColor = '#f0ad4e'; // Orange color for values above 40
    } else {
        backgroundColor = '#5cb85c'; // Light green color for values below 40
    }

    const ctx = chartElement.getContext('2d');
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [data, 100 - data],
                backgroundColor: [backgroundColor, '#eaeaea'],
                borderWidth: 0,
            }]
        },
        options: {
            responsive: true,
            cutoutPercentage: 80,
            legend: {
                display: false
            },
            tooltips: {
                enabled: false
            }
        }
    });
    return chart;
}

function updateCharts() {
    if (data) {
        // Destroy previous chart instances if they exist
        if (cpuChart) {
            cpuChart.destroy();
        }
        if (memChart) {
            memChart.destroy();
        }

        // Update CPU chart
        cpuChart = createChart(document.getElementById('cpu-chart'), data.cpu_usage);

        // Update Memory chart
        memChart = createChart(document.getElementById('mem-chart'), data.mem_usage);
    }
}

function updateNextUpdateTime(nextUpdate) {
    clearInterval(countdownInterval);

    countdownInterval = setInterval(function () {
        const now = new Date();
        const remainingTime = Math.max(Math.floor((nextUpdate - now) / 1000), 0);

        // Display the countdown on the dashboard
        $("#next-update-time").text(remainingTime > 0 ? "" + remainingTime + "s" : " 0s");

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
        }
    }, 1000); // Update every 1 second (1000 milliseconds)
}

function updateData() {
    $.ajax({
        url: "/data",
        type: "GET",
        dataType: "json",
        success: function (responseData) {
            data = responseData;
            $("#cpu-usage").text(data.cpu_usage + "%");
            $("#mem-usage").text(data.mem_usage + "%");
            $("#msg").text(data.msg);

            // Check if status is "Warning" and display the warning alert
            if (data.msg === "Warning") {
                $("#msg").removeClass("alert-ok").addClass("alert-warning");
                $("#msg").text("System Status: Warning - CPU or Memory usage is above 80%");
            } else {
                // If status is not "Warning," set it back to "OK" and show the success alert
                $("#msg").removeClass("alert-warning").addClass("alert-ok");
                $("#msg").text("System Status: Everything is running smoothly.");
            }

            var now = new Date();
            var nextUpdate = new Date(now.getTime() + 5000);
            updateNextUpdateTime(nextUpdate);
            // Call updateCharts() after data is fetched to update the charts
            updateCharts();
        },
        error: function () {
            console.log("Error fetching data.");
        }
    });
}
