import React, { useId } from 'react';

interface TnnmcEmblemProps {
  className?: string;
  size?: number;
}

/**
 * Official Tamil Nadu Nurses and Midwives Council (TNNMC) Emblem
 * Matching the official seal:
 * "THE TAMILNADU NURSES AND MIDWIVES COUNCIL"
 * "ESTABLISHED 1926 / UNDER ACT III"
 * Central figure of Florence Nightingale holding the hanging lantern.
 */
export const TnnmcEmblem: React.FC<TnnmcEmblemProps> = ({
  className = '',
  size = 44,
}) => {
  const uid = useId().replace(/:/g, '');
  const topArcId = `tnnmc-top-arc-${uid}`;
  const bottomArc1Id = `tnnmc-bot-arc1-${uid}`;
  const bottomArc2Id = `tnnmc-bot-arc2-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      role="img"
      aria-label="The Tamilnadu Nurses and Midwives Council Official Emblem"
    >
      <defs>
        {/* Clockwise upper arc for "THE TAMILNADU NURSES AND MIDWIVES COUNCIL" */}
        <path
          id={topArcId}
          d="M 59,255 A 151,151 0 1,1 341,255"
        />
        {/* Counter-clockwise lower inner arc for "ESTABLISHED 1926" */}
        <path
          id={bottomArc1Id}
          d="M 105,285 A 152,152 0 0,0 295,285"
        />
        {/* Counter-clockwise lower outer arc for "UNDER ACT III" */}
        <path
          id={bottomArc2Id}
          d="M 98,304 A 170,170 0 0,0 302,304"
        />
      </defs>

      {/* Crisp White Circular Base */}
      <circle cx="200" cy="200" r="194" fill="#FFFFFF" />

      {/* Outer Red Ring */}
      <circle
        cx="200"
        cy="200"
        r="188"
        fill="#FFFFFF"
        stroke="#EB0000"
        strokeWidth="5.5"
      />

      {/* Inner Red Ring */}
      <circle
        cx="200"
        cy="200"
        r="134"
        fill="#FFFFFF"
        stroke="#EB0000"
        strokeWidth="4.5"
      />

      {/* Curved Title: THE TAMILNADU NURSES AND MIDWIVES COUNCIL */}
      <text
        fill="#EB0000"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="24.5"
        fontWeight="600"
        letterSpacing="1.2"
      >
        <textPath
          href={`#${topArcId}`}
          startOffset="50%"
          textAnchor="middle"
        >
          THE TAMILNADU NURSES AND MIDWIVES COUNCIL
        </textPath>
      </text>

      {/* Curved Bottom Line 1: ESTABLISHED 1926 */}
      <text
        fill="#EB0000"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="15.5"
        fontWeight="600"
        letterSpacing="0.8"
      >
        <textPath
          href={`#${bottomArc1Id}`}
          startOffset="50%"
          textAnchor="middle"
        >
          ESTABLISHED 1926
        </textPath>
      </text>

      {/* Curved Bottom Line 2: UNDER ACT III */}
      <text
        fill="#EB0000"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="15.5"
        fontWeight="600"
        letterSpacing="0.8"
      >
        <textPath
          href={`#${bottomArc2Id}`}
          startOffset="50%"
          textAnchor="middle"
        >
          UNDER ACT III
        </textPath>
      </text>

      {/* Central Illustration: Lady with the Lamp (Florence Nightingale) in Red Stencil Style */}
      <g fill="#EB0000" stroke="#EB0000">
        {/* Headscarf / Veil Outer Contour */}
        <path
          d="M 188,125 C 185,112 188,94 198,87 C 206,82 216,86 219,98 C 221,108 220,120 222,128"
          fill="none"
          strokeWidth="3.8"
          strokeLinecap="round"
        />
        {/* Inner Hood & Hair Frame */}
        <path
          d="M 192,123 C 191,111 194,97 201,93 C 208,90 214,95 215,106 C 216,115 214,122 212,127"
          fill="none"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* Facial Features (Eyes, Nose, Mouth) */}
        <circle cx="203" cy="105" r="1.6" stroke="none" />
        <circle cx="210" cy="106" r="1.5" stroke="none" />
        <path
          d="M 207,106 L 208,112 L 205,113"
          fill="none"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 203,117 Q 206,119 209,117"
          fill="none"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Chin & Neckline Collar */}
        <path
          d="M 196,120 Q 204,127 212,120"
          fill="none"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M 193,128 Q 203,137 215,129"
          fill="none"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Right Shoulder & Arm holding the Lantern (Viewer's Left) */}
        <path
          d="M 190,127 C 182,130 177,136 173,144 C 168,142 163,145 161,152 C 160,157 163,162 168,163 C 173,163 177,157 179,151 C 183,147 187,142 190,136"
          fill="none"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Hanging Lantern on Viewer's Left */}
        {/* Lantern Ring & Chain */}
        <path
          d="M 167,161 L 167,169 M 162,169 L 173,169"
          fill="none"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        {/* Lantern Body Frame */}
        <rect
          x="160"
          y="169"
          width="15"
          height="23"
          rx="2.5"
          fill="none"
          strokeWidth="3"
        />
        {/* Lantern Inner Flame / Cross Detail */}
        <path
          d="M 167.5,174 L 167.5,187 M 164,180 L 171,180"
          fill="none"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* Lantern Base */}
        <path
          d="M 159,193 L 176,193"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Left Shoulder, Sleeve & Arm (Viewer's Right) */}
        <path
          d="M 220,128 C 227,136 231,152 232,172 C 233,188 233,205 230,218"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 215,133 C 220,148 222,168 221,186 C 220,198 221,210 224,218"
          fill="none"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Left Hand & Cuff holding Dress Drapery */}
        <path
          d="M 221,217 C 225,215 231,216 234,221 C 235,226 230,231 225,229 C 221,227 220,222 221,217 Z"
          fill="none"
          strokeWidth="3"
        />

        {/* Bodice & Waist Apron Contour */}
        <path
          d="M 189,134 C 187,150 187,168 189,182"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 214,175 C 216,181 213,187 208,189"
          fill="none"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Flowing Skirt Left Outer Contour */}
        <path
          d="M 188,180 C 177,202 169,232 164,262 C 160,280 156,295 153,306"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Flowing Skirt Right Outer Contour (Gathered by Left Hand) */}
        <path
          d="M 231,227 C 235,248 238,274 241,298 L 228,303"
          fill="none"
          strokeWidth="3.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner Skirt Drapery Folds & Etching Lines */}
        <path
          d="M 223,228 C 219,252 214,278 212,306"
          fill="none"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 228,232 C 227,258 226,282 224,306"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 192,235 C 197,252 206,262 218,256"
          fill="none"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M 198,266 C 204,274 212,275 219,269"
          fill="none"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M 172,262 C 169,278 166,294 164,308"
          fill="none"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M 183,275 C 181,287 179,298 178,308"
          fill="none"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Subtle Stencil Texture Marks on Apron */}
        <circle cx="209" cy="197" r="1.8" stroke="none" />
        <circle cx="212" cy="208" r="1.6" stroke="none" />
        <circle cx="206" cy="221" r="1.5" stroke="none" />
        <circle cx="187" cy="252" r="1.6" stroke="none" />
        <circle cx="195" cy="285" r="1.8" stroke="none" />
        <circle cx="203" cy="292" r="1.6" stroke="none" />

        {/* Skirt Bottom Hem & Shoes/Base */}
        <path
          d="M 159,303 C 169,312 185,317 203,316 C 216,315 227,310 235,302"
          fill="none"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <path
          d="M 176,314 C 175,322 181,328 189,327 C 195,326 198,321 199,316"
          fill="none"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M 202,316 C 201,324 205,330 212,331 M 196,331 C 201,324 206,320 214,316"
          fill="none"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};
