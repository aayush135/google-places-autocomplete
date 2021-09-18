import React, { useState, useEffect, useRef } from "react";

let autoComplete;

const loadScript = (url, callback) => {
    //create script element
    let script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState === "loaded" || script.readyState === "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {
        script.onload = () => callback();
    }

    script.src = url;
    //append created script in head tag of html(index .html)
    document.getElementsByTagName("head")[0].appendChild(script);
};

function handleScriptLoad(updateSearched, autoCompleteInputRef) {
    autoComplete = new window.google.maps.places.Autocomplete(
        autoCompleteInputRef.current,
        { types: ["(cities)"], componentRestrictions: { country: "us" } }
    );

    autoComplete.setFields(["address_components", "formatted_address"]);
    autoComplete.addListener("place_changed", () =>
        handlePlaceSelect(updateSearched)
    );
}

async function handlePlaceSelect(updateSearched) {
    const addressObject = autoComplete.getPlace();
    const query = addressObject.formatted_address;
    updateSearched(query);
}

function App() {
    const [searched, setSearched] = useState("");
    const autoCompleteInputRef = useRef(null);

    useEffect(() => {
        loadScript(
            `https://maps.googleapis.com/maps/api/js?key=AIzaSyCiDxuLNMr779WK6nHOtNm623fVjtl5PgE&libraries=places`,
            () => handleScriptLoad(setSearched, autoCompleteInputRef)
        );
    }, []);

    return (
        <div className="search-location-input">
            <input
                ref={autoCompleteInputRef}
                onChange={event => setSearched(event.target.value)}
                value={searched}
            />
        </div>
    );
}

export default App;
