let map;

let startPosition = {lat: 36.735, lng: -95.945};

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
        center: startPosition,
        zoom: 12.5,
        mapId: "a137be4faf3a019a",
    });

    var bottomLat = 36.695;
    var topLat = 36.773;
    var leftLng = -96.015;
    var rightLng = -95.888;
    const bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(bottomLat, leftLng),
        new google.maps.LatLng(topLat, rightLng)
    );

    let image = "./mapOverlay.png";

    /**
     * The custom USGSOverlay object contains the USGS image,
     * the bounds of the image, and a reference to the map.
     */
    class USGSOverlay extends google.maps.OverlayView {
        bounds;
        image;
        div;
        constructor(bounds, image) {
        super();
        this.bounds = bounds;
        this.image = image;
        }


        /**
         * onAdd is called when the map's panes are ready and the overlay has been
         * added to the map.
         */
        onAdd() {
            this.div = document.createElement("div");
            this.div.style.borderStyle = "none";
            this.div.style.borderWidth = "0px";
            this.div.style.position = "absolute";
        
            // Create the img element and attach it to the div.
            const img = document.createElement("img");
        
            img.src = this.image;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.position = "absolute";
            this.div.appendChild(img);
        
            // Add the element to the "overlayLayer" pane.
            const panes = this.getPanes();
        
            panes.overlayMouseTarget.appendChild(this.div);
            
            console.log(this.div);
        }

        draw() {
            // We use the south-west and north-east
            // coordinates of the overlay to peg it to the correct position and size.
            // To do this, we need to retrieve the projection from the overlay.
            const overlayProjection = this.getProjection();
            // Retrieve the south-west and north-east coordinates of this overlay
            // in LatLngs and convert them to pixel coordinates.
            // We'll use these coordinates to resize the div.
            const sw = overlayProjection.fromLatLngToDivPixel(
            this.bounds.getSouthWest(),
            );
            const ne = overlayProjection.fromLatLngToDivPixel(
            this.bounds.getNorthEast(),
            );
        
            // Resize the image's div to fit the indicated dimensions.
            if (this.div) {
            this.div.style.left = sw.x + "px";
            this.div.style.top = ne.y + "px";
            this.div.style.width = Math.abs(ne.x - sw.x) + "px";
            this.div.style.height = Math.abs(sw.y - ne.y) + "px";
            }
        }

        /**
         * The onRemove() method will be called automatically from the API if
         * we ever set the overlay's map property to 'null'.
         */
        onRemove() {
            if (this.div) {
            this.div.parentNode.removeChild(this.div);
            delete this.div;
            }
        }
        /**
         *  Set the visibility to 'hidden' or 'visible'.
         */
        hide() {
            if (this.div) {
            this.div.style.visibility = "hidden";
            }
        }
        show() {
            if (this.div) {
            this.div.style.visibility = "visible";
            }
        }
        toggle() {
            if (this.div) {
            if (this.div.style.visibility === "hidden") {
                this.show();
            } else {
                this.hide();
            }
            }
        }
        toggleDOM(map) {
            if (this.getMap()) {
            this.setMap(null);
            } else {
            this.setMap(map);
            }
        }
    }

    const overlay = new USGSOverlay(bounds, image);

    overlay.setMap(map);
}