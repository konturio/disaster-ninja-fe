import { useState, useRef } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';
import { Tooltip } from './Tooltip';
import { InfoPopover } from './InfoPopover';

const FILLER_TEXT = `Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.`;

const MD_TEXT =
  'The availability of strongly built shelters that give protection from extreme weather events or attacks is an indicator of community resilience. \nThis map shows areas at risk of failing to protect inhabitants in case of emergencies due to the combination of high population density and long distance to the nearest bunker.\n\n\n- Concept of areas © Brahmagupta, René Descartes\n\n\n- Copernicus Global Land Service: Land Cover 100 m: Marcel Buchhorn,Bruno Smets,Luc Bertels,Bert De Roo,MyroslavaLesiv,Nandin - Erdene Tsendbazar,… Steffen Fritz. (2020). Copernicus Global Land Service: Land Cover 100m: collection 3: epoch 2019: Globe (Version V3.0.1) Data set. Zenodo. http://doi.org/10.5281/zenodo.3939050\n\n\n- Dataset: Schiavina M.,Freire S.,Carioli A.,MacManus K. (2023): GHS-POP R2023A - GHS population grid multitemporal (1975-2030).European Commission,Joint Research Centre (JRC) PID: http://data.europa.eu/89h/2ff68a52-5b5b-4a22-8f40-c41da8332cfe,doi:10.2905/2FF68A52-5B5B-4A22-8F40-C41DA8332CFE Concept & Methodology: Freire S.,MacManus K.,Pesaresi M.,Doxsey-Whitfield E.,Mills J. (2016) Development of new open and free multi-temporal global population grids at 250 m resolution. Geospatial Data in a Changing World.,Association of Geographic Information Laboratories in Europe (AGILE),AGILE 2016\n\n\n- Facebook Connectivity Lab and Center for International Earth Science Information Network - CIESIN - Columbia University. 2016. High Resolution Settlement Layer (HRSL). Source imagery for HRSL © 2016 DigitalGlobe. https://dataforgood.fb.com/tools/population-density-maps/\n\n\n- Geoalert Urban Mapping: Chechnya,Moscow region,Tyva,Tashkent,Bukhara,Samarkand,Navoi,Chirchiq - https://github.com/Geoalert/urban-mapping\n\n\n- © Kontur https://kontur.io/\n\n\n- Microsoft Buildings: Australia,Canada,Tanzania,Uganda,USA: This data is licensed by Microsoft under the Open Data Commons Open Database License (ODbL).\n\n\n- NZ Building Outlines data sourced from the LINZ Data Service - https://data.linz.govt.nz/\n\n\n- © OpenStreetMap contributors https://www.openstreetmap.org/copyright';

function ControlledPopover() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <h3>Popover Controlled</h3>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger onClick={() => setOpen((v) => !v)}>trigger, top</PopoverTrigger>
        <PopoverContent>{FILLER_TEXT}</PopoverContent>
      </Popover>
    </div>
  );
}

function TooltipExamples() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <h3>Tooltip Examples</h3>

      <div style={{ marginBottom: 20 }}>
        <h4>Children Trigger</h4>
        <p>
          some text ...
          <Tooltip content={'This is a tooltip with children trigger.\n ' + FILLER_TEXT}>
            <button>Hover me (children)</button>
          </Tooltip>
          some text ...
        </p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h4>Ref-based Trigger</h4>
        <button ref={buttonRef}>Hover me (ref trigger)</button>
        <Tooltip
          content={'This is a tooltip with ref trigger.\n ' + FILLER_TEXT}
          triggerRef={buttonRef}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <h4>Different Placements</h4>
        <div style={{ display: 'flex', gap: 20 }}>
          <Tooltip content="Top tooltip" placement="top">
            <button>Top</button>
          </Tooltip>
          <Tooltip content="Bottom tooltip" placement="bottom">
            <button>Bottom</button>
          </Tooltip>
          <Tooltip content="Left tooltip" placement="left">
            <button>Left</button>
          </Tooltip>
          <Tooltip content="Right tooltip" placement="right">
            <button>Right</button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

export default (
  <div>
    <style>{`
      button:not([type="button"]),.trigger{outline:thin dotted green;}
      #root{margin:16px;outline:thin dotted green;}
    `}</style>
    <Popover>
      <PopoverTrigger>[trigger, bottom]</PopoverTrigger>
      <PopoverContent>{FILLER_TEXT}</PopoverContent>
    </Popover>
    <div style={{ marginTop: 200 }}>
      <Popover placement="right">
        <PopoverTrigger onClick={() => 1}>[trigger, right]</PopoverTrigger>
        <PopoverContent>{FILLER_TEXT}</PopoverContent>
      </Popover>
    </div>
    <div style={{ marginTop: 100, marginLeft: 400, marginBottom: 100 }}>
      <Popover placement="left">
        <PopoverTrigger onClick={() => 1}>[trigger, left]</PopoverTrigger>
        <PopoverContent>{FILLER_TEXT}</PopoverContent>
      </Popover>
    </div>
    <ControlledPopover />
    <TooltipExamples />
    <p>
      some text some text some text ... short
      <InfoPopover content="some text some text some text" />
      <hr />
      long text <InfoPopover content={MD_TEXT} />
    </p>
  </div>
);
