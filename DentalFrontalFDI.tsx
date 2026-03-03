import React from "react";

import upperCentral from "./upper_central.png";
import upperLateral from "./upper_lateral.png";
import upperCanine from "./upper_canine.png";
import upperPremolar from "./upper_premolar.png";
import upperMolar from "./upper_molar.png";

import lowerCentral from "./lower_central.png";
import lowerLateral from "./lower_lateral.png";
import lowerCanine from "./lower_canine.png";
import lowerPremolar from "./lower_premolar.png";
import lowerMolar from "./lower_molar.png";

interface Props {
  selectedTeeth: number[];
  onSelect: (tooth: number) => void;
}

interface ToothProps {
  num: number;
  selected: boolean;
  onClick: (num: number) => void;
}

const upperOrder = [
  18,17,16,15,14,13,12,11,
  21,22,23,24,25,26,27,28
];

const lowerOrder = [
  48,47,46,45,44,43,42,41,
  31,32,33,34,35,36,37,38
];

const convertFDIToUR = (num: number) => {
  const str = num.toString();
  const quadrant = str[0];   // 1,2,3,4
  const toothNumber = str[1]; // 1-8

  const map: Record<string,string> = {
    "1": "UR",
    "2": "UL",
    "3": "LL",
    "4": "LR"
  };

  return `${map[quadrant]}${toothNumber}`;
};

const getImage = (num:number) => {

  if ([11,21].includes(num)) return upperCentral;
  if ([12,22].includes(num)) return upperLateral;
  if ([13,23].includes(num)) return upperCanine;
  if ([14,15,24,25].includes(num)) return upperPremolar;
  if ([16,17,18,26,27,28].includes(num)) return upperMolar;

  if ([31,41].includes(num)) return lowerCentral;
  if ([32,42].includes(num)) return lowerLateral;
  if ([33,43].includes(num)) return lowerCanine;
  if ([34,35,44,45].includes(num)) return lowerPremolar;
  if ([36,37,38,46,47,48].includes(num)) return lowerMolar;

  return "";
};

const Tooth: React.FC<ToothProps> = ({ num, selected, onClick }) => {

  const displayCode = convertFDIToUR(num);

  return (
    <div
      onClick={() => onClick(num)}
      style={{
        cursor: "pointer",
        padding: "2px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative"
      }}
    >
      <img
        src={getImage(num)}
        alt={displayCode}
        title={displayCode}
        style={{
          height: "150px",
          objectFit: "contain",
          display: "block",
          transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease, filter 0.3s ease",
          transform: selected
            ? "translateY(-6px) scale(1.1)"
            : "translateY(0) scale(1)",
          opacity: selected ? 1 : 0.45,
          filter: selected
            ? "drop-shadow(0 4px 12px rgba(20,184,166,0.5))"
            : "none"
        }}
      />
    </div>
  );
};

const DentalFrontalFDI: React.FC<Props> = ({ selectedTeeth, onSelect }) => {

  const isSelected = (num:number) => selectedTeeth.includes(num);

  return (
    <div style={{ textAlign:"center", position:"relative" }}>

      <div style={{
        position:"absolute",
        left:"50%",
        top:"0",
        bottom:"0",
        width:"2px",
        background:"#d1d5db",
        transform:"translateX(-50%)"
      }} />

      <div style={{
        display:"flex",
        justifyContent:"space-between",
        width:"80%",
        margin:"0 auto 10px auto",
        fontSize:"14px",
        color:"#6b7280",
        fontWeight:500
      }}>
        <span>الفك العلوي - يمين</span>
        <span>الفك العلوي - شمال</span>
      </div>

      <div style={{
        display:"flex",
        justifyContent:"center",
        marginBottom:"60px"
      }}>
        {upperOrder.map(t => (
          <Tooth
            key={t}
            num={t}
            selected={isSelected(t)}
            onClick={onSelect}
          />
        ))}
      </div>

      <div
        style={{
          width:"80%",
          height:"2px",
          background:"#e5e7eb",
          margin:"0 auto 40px auto"
        }}
      />

      <div style={{
        display:"flex",
        justifyContent:"space-between",
        width:"80%",
        margin:"0 auto 10px auto",
        fontSize:"14px",
        color:"#6b7280",
        fontWeight:500
      }}>
        <span>الفك السفلي - يمين</span>
        <span>الفك السفلي - شمال</span>
      </div>

      <div style={{
        display:"flex",
        justifyContent:"center"
      }}>
        {lowerOrder.map(t => (
          <Tooth
            key={t}
            num={t}
            selected={isSelected(t)}
            onClick={onSelect}
          />
        ))}
      </div>

    </div>
  );
};

export default DentalFrontalFDI;