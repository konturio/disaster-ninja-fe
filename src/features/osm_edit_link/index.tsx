import { currentMapPositionAtom, sideControlsBarAtom } from "~core/shared_state";
import { controlVisualGroup } from "~core/shared_state/sideControlsBar";
import { EDIT_IN_OSM_CONTROL_ID, EDIT_IN_OSM_CONTROL_NAME } from "./constants";
import EditInOsmIcon from "./EditInOsmIcon";

export function initOsmEditLink() {
  sideControlsBarAtom.addControl.dispatch({
    id: EDIT_IN_OSM_CONTROL_ID,
    name: EDIT_IN_OSM_CONTROL_NAME,
    active: false,
    visualGroup: controlVisualGroup.noAnalitics,
    icon: <EditInOsmIcon />,
    onClick: () => {
      const position = currentMapPositionAtom.getState()
      if (!position) return;
      const { lat, lng, zoom } = position
      const url = `https://www.openstreetmap.org/edit?#map=${zoom}/${lat}/${lng}`
      window.open(url)?.focus()
    }
  });
}
