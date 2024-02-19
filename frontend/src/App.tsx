function App() {
    return (
        <>
            <dialog id="fridayModal">
                <h2 id="fridayModalTitle">modal title</h2>
                <p id="fridayModalContent">modal content...</p>
                <button id="closeBtn">close</button>
            </dialog>
            <button id="openBtn">open modal</button>
            <div className="left">
                <div className="l-1">
                    <div className="l-1-1">
                        <img
                            className="moon1"
                            src="./public/images/moons/sd1.svg"
                        />
                    </div>
                    <div className="l-1-2">
                        <img
                            className="moon2"
                            src="public/images/moons/sd2.svg"
                        />
                    </div>
                    <div className="l-1-3">
                        <img
                            className="moon3"
                            src="public/images/moons/sd3.svg"
                        />
                    </div>
                    <div className="l-1-4">
                        <img
                            className="moon4"
                            src="public/images/moons/sd4.svg"
                        />
                    </div>
                    <div className="l-1-5">
                        <img
                            className="moon5"
                            src="public/images/moons/sd5.svg"
                        />
                    </div>
                </div>
                <div className="l-2">
                    <div className="l-2-1">
                        <strong className="dateNormal">20</strong>
                        <span>.</span>
                        <div className="monthNormal">04</div>
                        <span>.</span>
                        <strong className="yearNormal">571</strong>
                    </div>
                    <div className="l-2-2">
                        <strong>|</strong>
                    </div>
                    <div className="l-2-3">
                        <strong className="dateHicri">27</strong>
                        <span id="p1">.</span>
                        <div className="monthHicri">07</div>
                        <span id="p2">.</span>
                        <strong className="yearHicri">1400</strong>
                    </div>
                </div>
                <div className="l-3">
                    <div className="l-3-timecontainer">
                        <div className="l-3-1"></div>
                        <div className="l-3-2">:</div>
                        <div className="l-3-3"></div>
                    </div>

                    <svg
                        className="seperator"
                        width="90%"
                        height="200"
                        viewBox="-42 6 100 100"
                        preserveAspectRatio="none"
                        style={{ display: "block", margin: "auto" }}
                    >
                        <path d="M8 7 L57 8 L8 9 T -41 8 L8 7" fill="#1f4e5f" />
                    </svg>

                    <div className="timeLeft">
                        <span className="timeLeft-before"></span>
                        <span className="timeLeft-after">
                            <span className="countdown-hour"></span>
                            <span className="timeMiddle"> : </span>
                            <span className="countdown-minute"></span>
                        </span>
                    </div>
                </div>
                <div className="l-4">
                    <div className="l-4-1 title"></div>
                    <div id="infoText" className="l-4-2 text resize"></div>
                    <div className="l-4-3 source"></div>
                </div>
                <div className="l-6">
                    <div className="l-6-1 tri">▶</div>
                    <div className="l-6-2 rec" id="box1">
                        <div className="l-6-2-1 l6-title">
                            <strong id="importantDate1Day">00</strong>
                            <span>.</span>
                            <strong id="importantDate1Month">00</strong>
                            <span>.</span>
                            <strong id="importantDate1Year">0000</strong>
                        </div>
                        <div
                            className="l-6-2-2 l6-description resize"
                            id="importantDateTextLeft"
                        ></div>
                    </div>
                    <div className="l-6-3 tri">▶</div>
                    <div className="l-6-4 rec">
                        <div className="l-6-4-1 l6-title">
                            <strong id="importantDate2Day">00</strong>
                            <span>.</span>
                            <strong id="importantDate2Month">00</strong>
                            <span>.</span>
                            <strong id="importantDate2Year">0000</strong>
                        </div>
                        <div
                            className="l-6-4-2 l6-description resize"
                            id="importantDateTextRight"
                        ></div>
                    </div>
                    <div className="l-6-5 tri">▶</div>
                </div>
            </div>
            <div className="right">
                <svg
                    id="imsak"
                    className="imsak"
                    data-name="imsak"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 775.92 314.53"
                >
                    <defs>
                        <style>
                            {`@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900");
                                @font-face {
                                    font-family: "Hafs";
                                    src: url("hafs.otf");
                                    fontWeight: normal;
                                }`}
                        </style>
                        <linearGradient
                            id="linear-gradient"
                            x1="-1412.22"
                            y1="-2370.21"
                            x2="-1412.31"
                            y2="-2147.27"
                            gradientTransform="translate(2891.64 1182.92) rotate(-36.02)"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stopColor="#0c7f82" />
                            <stop
                                offset="0.81"
                                stopColor="#083640"
                                stopOpacity="0"
                            />
                        </linearGradient>
                        <linearGradient
                            id="linear-gradient-2"
                            x1="301.13"
                            y1="39.94"
                            x2="393.1"
                            y2="199.24"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop id="stop1" offset="0" stopColor="#2c7291" />
                            <stop id="stop2" offset="1" stopColor="#1f5260" />
                        </linearGradient>
                    </defs>
                    <rect
                        id="s1"
                        fill="#2c7291"
                        x="386.98"
                        y="86.18"
                        width="388.94"
                        height="108.21"
                    />
                    <path
                        id="s2"
                        fill="url(#linear-gradient)"
                        d="M431,108.47h0a54.11,54.11,0,0,0-87.53,63.64h0l91.2,142.42,103.69-75.41Z"
                    />
                    <path
                        id="s3"
                        fill="url(#linear-gradient-2)"
                        d="M425,101.77h0L339.19,18,257.63,121.16l100.61,65h0A54.09,54.09,0,0,0,425,101.77Z"
                    />
                    <path
                        id="s4"
                        fill="#1f5260"
                        d="M286.83,140l-29.2-18.86L337,20.79A65.75,65.75,0,0,0,297.92,8H70a66,66,0,0,0,0,132H286.83Z"
                    />
                    <path
                        id="s1"
                        fill="#2c7291"
                        d="M293.94,0H66a66,66,0,1,0,0,132H293.9a66,66,0,1,0,0-132Z"
                    />
                    <text
                        id="tr"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        x="180"
                        y="75"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="bold"
                        className="text"
                        opacity="1"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        İMSAK
                    </text>
                    <text
                        id="ar"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        x="180"
                        y="75"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="bold"
                        className="text"
                        opacity="0"
                        style={{ fontFamily: "Hafs" }}
                    >
                        الإمساك
                    </text>
                    <text
                        id="de"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        x="180"
                        y="75"
                        fontSize="0.9em"
                        fill="white"
                        fontWeight="bold"
                        className="text"
                        opacity="0"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        MORGENS
                    </text>
                    <text
                        textAnchor="middle"
                        x="535"
                        y="165"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="hour1 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                    <text
                        textAnchor="middle"
                        x="582"
                        y="165"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="hour2 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                    <text
                        x="610"
                        y="160"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        :
                    </text>
                    <text
                        textAnchor="middle"
                        x="653"
                        y="165"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="minute1 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                    <text
                        textAnchor="middle"
                        x="701"
                        y="165"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="minute2 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                </svg>

                <svg
                    id="gunes"
                    className="gunes"
                    data-name="gunes"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 775.92 230"
                >
                    <defs>
                        <style id="style">
                            {`   @import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900");
                            @font-face {
                                font - family: "Hafs";
                            src: url("hafs.otf");
                            fontWeight: normal;
                        }
                            .cls-1 {
                                fill: #2c7291;
                        }

                            .cls-2 {
                                fill: url(#linear-gradient);
                        }

                            .cls-3 {
                                fill: url(#linear-gradient-2);
                        }

                            .cls-4 {
                                fill: #1f5260;
                        }
                         `}
                        </style>
                        <linearGradient
                            id="linear-gradient"
                            x1="-1629.12"
                            y1="-2477.87"
                            x2="-1629.21"
                            y2="-2254.93"
                            gradientTransform="translate(3130.38 1105.3) rotate(-36.02)"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stopColor="#083640" />
                            <stop
                                offset="0.81"
                                stopColor="#083640"
                                stopOpacity="0"
                            />
                        </linearGradient>
                        <linearGradient
                            id="linear-gradient-2"
                            x1="294.13"
                            y1="63.37"
                            x2="427.86"
                            y2="140.58"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop id="stop1" offset="0" stopColor="#2c7291" />
                            <stop id="stop2" offset="1" stopColor="#1f5260" />
                        </linearGradient>
                    </defs>
                    <rect
                        id="s1"
                        fill="#2c7291"
                        x="386.98"
                        y="49.04"
                        width="388.94"
                        height="108.21"
                    />
                    <path
                        id="s2"
                        fill="url(#linear-gradient)"
                        d="M431,71.33h0A54.11,54.11,0,0,0,343.5,135h0l91.2,142.42L538.39,202Z"
                    />
                    <path
                        id="s3"
                        fill="url(#linear-gradient-2)"
                        d="M413.52,56h0l-.23-.13-1-.54L325.94,8.27l-48.79,121.6,96.32,25.69h0a54.12,54.12,0,0,0,40-99.56Z"
                    />
                    <path
                        id="s4"
                        fill="#1f5260"
                        d="M277.15,129.87,325.27,9.94A65.77,65.77,0,0,0,297.92,4H70a66,66,0,0,0,0,132H297.92c.7,0,1.39,0,2.09-.05Z"
                    />
                    <path
                        id="s1"
                        fill="#2c7291"
                        d="M293.92,0H66a66,66,0,0,0,0,132H293.92a66,66,0,0,0,0-132Z"
                    />
                    <text
                        id="tr"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        x="180"
                        y="74"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="bold"
                        className="text"
                        letterSpacing="normal"
                        opacity="1"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        GÜNEŞ
                    </text>
                    <text
                        id="ar"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        x="180"
                        y="74"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="bold"
                        className="text"
                        letterSpacing="normal"
                        opacity="0"
                        style={{ fontFamily: "Hafs" }}
                    >
                        الأيام الدينة
                    </text>
                    <text
                        id="de"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        x="180"
                        y="74"
                        fontSize="0.9em"
                        fill="white"
                        fontWeight="bold"
                        className="text"
                        letterSpacing="normal"
                        opacity="0"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        SONNENA.
                    </text>
                    <text
                        textAnchor="middle"
                        x="535"
                        y="128"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="hour1 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                    <text
                        textAnchor="middle"
                        x="582"
                        y="128"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="hour2 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                    <text
                        x="610"
                        y="123"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        :
                    </text>
                    <text
                        textAnchor="middle"
                        x="653"
                        y="128"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="minute1 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                    <text
                        textAnchor="middle"
                        x="701"
                        y="128"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="minute2 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                </svg>

                <svg
                    className="ogle"
                    id="ogle"
                    data-name="ogle"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 775.92 1267.86"
                >
                    <defs>
                        <style>
                            {`@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900");
                            @font-face {
                                font - family: "Hafs";
                            src: url("hafs.otf");
                            fontWeight: normal;
                        `}
                        </style>
                        <linearGradient
                            id="linear-gradient"
                            x1="2595.09"
                            y1="-1115.81"
                            x2="2595"
                            y2="-891.49"
                            gradientTransform="translate(-1088.76 2477.11) rotate(-36.02)"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stopColor="#083640" />
                            <stop
                                offset="0.81"
                                stopColor="#083640"
                                stopOpacity="0"
                            />
                        </linearGradient>
                        <linearGradient
                            id="linear-gradient-2"
                            x1="272.95"
                            y1="75.53"
                            x2="422.19"
                            y2="75.53"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop id="stop1" offset="0" stopColor="#2c7291" />
                            <stop id="stop2" offset="1" stopColor="#1f5260" />
                        </linearGradient>
                    </defs>
                    <rect
                        id="s1"
                        fill="#2c7291"
                        x="386.98"
                        y="38.44"
                        width="388.94"
                        height="108.21"
                    />
                    <path
                        id="s2"
                        fill="url(#linear-gradient)"
                        d="M429.85,60.54h0a54.44,54.44,0,1,0-88.06,64h0l91.76,143.29L537.88,192Z"
                    />
                    <path
                        id="s3"
                        fill="url(#linear-gradient-2)"
                        d="M408.39,43.19l0,0-.52-.22-1.24-.52L316,4.41,291.09,132.8,378,146H378l.19,0h0A54.11,54.11,0,0,0,408.39,43.19Z"
                    />
                    <path
                        id="s4"
                        fill="#1f5260"
                        d="M294.07,132.8l27.2-122.46a65.77,65.77,0,0,0-27.35-5.93H66a66,66,0,0,0,0,132H293.92c.7,0,26.65,0,27.35-.06Z"
                    />
                    <path
                        id="s1"
                        fill="#2c7291"
                        d="M358.67,66.42A66.4,66.4,0,0,0,294.07.05V0H66.42a66.42,66.42,0,1,0,0,132.83c.39,0,.77,0,1.16,0H291.09c.39,0,.77,0,1.16,0l1.17,0h.65A66.41,66.41,0,0,0,358.67,66.42Z"
                    />
                    <text
                        id="tr"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        x="180"
                        y="75"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="bold"
                        className="text"
                        opacity="1"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        ÖĞLE
                    </text>
                    <text
                        id="ar"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        x="180"
                        y="75"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="bold"
                        className="text"
                        opacity="0"
                        style={{ fontFamily: "Hafs" }}
                    >
                        الظهر
                    </text>
                    <text
                        id="de"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        x="180"
                        y="75"
                        fontSize="0.9em"
                        fill="white"
                        fontWeight="bold"
                        className="text"
                        opacity="0"
                        style={{
                            fontFamily: "Montserrat, sans-serif",
                            letterSpacing: "1px",
                        }}
                    >
                        MITTAGS
                    </text>
                    <text
                        textAnchor="middle"
                        x="535"
                        y="115"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="hour1 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                    <text
                        textAnchor="middle"
                        x="582"
                        y="115"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="hour2 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                    <text
                        x="610"
                        y="110"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        :
                    </text>
                    <text
                        textAnchor="middle"
                        x="653"
                        y="115"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="minute1 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                    <text
                        textAnchor="middle"
                        x="701"
                        y="115"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="minute2 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                </svg>

                <svg
                    id="ikindi"
                    className="ikindi"
                    data-name="ikindi"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 775.92 228.35"
                >
                    <defs>
                        <style>
                            {`@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900");
                            @font-face {
                                font - family: "Hafs";
                            src: url("hafs.otf");
                            fontWeight: normal;
                        `}
                        </style>
                        <linearGradient
                            id="linear-gradient"
                            x1="2394.8"
                            y1="-1218.57"
                            x2="2394.72"
                            y2="-995.63"
                            gradientTransform="translate(-864.7 2404.26) rotate(-36.02)"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stopColor="#083640" />
                            <stop
                                offset="0.81"
                                stopColor="#083640"
                                stopOpacity="0"
                            />
                        </linearGradient>
                        <linearGradient
                            id="linear-gradient-2"
                            x1="276.3"
                            y1="70.18"
                            x2="422.55"
                            y2="70.18"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop id="stop1" offset="0" stopColor="#2c7291" />
                            <stop id="stop2" offset="1" stopColor="#1f5260" />
                        </linearGradient>
                    </defs>
                    <title>Artboard 7 copy</title>
                    <rect
                        id="s1"
                        fill="#2c7291"
                        x="386.98"
                        y="0.01"
                        width="388.94"
                        height="108.21"
                    />
                    <path
                        id="s2"
                        fill="url(#linear-gradient)"
                        d="M431,22.29h0A54.11,54.11,0,0,0,343.5,85.93h0l91.2,142.42,103.69-75.41Z"
                    />
                    <path
                        id="s3"
                        fill="url(#linear-gradient-2)"
                        d="M440.33,54.12c0-.91,0-1.81-.07-2.71,0-.18,0-.36,0-.55,0-.72-.09-1.44-.16-2.16,0-.18-.05-.36-.07-.54q-.11-1.08-.27-2.16c0-.14-.05-.27-.07-.41-.12-.77-.25-1.53-.41-2.29,0-.07,0-.14,0-.21A54.48,54.48,0,0,0,392.65.1c-.15,0-1.29,0-2.87.07C388.61.09,387.43,0,386.24,0a54.56,54.56,0,0,0-7.83.57h-.08l-.24,0-.18,0-83.84,12.8,25.62,126.85,86.72-35.78v0a54.58,54.58,0,0,0,31.45-34.19l.06-.22c.23-.72.43-1.44.62-2.17,0-.16.09-.32.13-.48.16-.65.31-1.3.45-2l.15-.69c.12-.6.22-1.2.32-1.8.05-.29.1-.57.14-.85.09-.57.15-1.15.22-1.72,0-.32.08-.63.11-1,.06-.58.1-1.16.13-1.75,0-.31.06-.62.07-.93,0-.83.06-1.66.06-2.5,0-.06,0-.13,0-.19Z"
                    />
                    <path
                        id="s4"
                        fill="#1f5260"
                        d="M294.51,13.49l41.11-3.6c-.7,0-41-.05-41.7-.05H66a66,66,0,0,0,0,132H293.92a65.77,65.77,0,0,0,27.35-5.94Z"
                    />
                    <path
                        id="s1"
                        fill="#2c7291"
                        d="M358.67,79.85a66.41,66.41,0,0,0-64.6-66.38v0H66.42a66.42,66.42,0,1,0,0,132.83c.39,0,.77,0,1.16,0H291.09c.39,0,.77,0,1.16,0l1.17,0h.65A66.41,66.41,0,0,0,358.67,79.85Z"
                    />
                    <text
                        id="tr"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        x="180"
                        y="85"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="bold"
                        className="text"
                        opacity="1"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        İKİNDİ
                    </text>
                    <text
                        id="ar"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        x="180"
                        y="85"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="bold"
                        className="text"
                        opacity="0"
                        style={{ fontFamily: "Hafs" }}
                    >
                        العصر
                    </text>
                    <text
                        id="de"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        x="180"
                        y="85"
                        fontSize="0.9em"
                        fill="white"
                        fontWeight="bold"
                        className="text"
                        opacity="0"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        NACHM.
                    </text>
                    <text
                        textAnchor="middle"
                        x="535"
                        y="80"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="hour1 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                    <text
                        textAnchor="middle"
                        x="582"
                        y="80"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="hour2 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                    <text
                        x="610"
                        y="75"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        :
                    </text>
                    <text
                        textAnchor="middle"
                        x="653"
                        y="80"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="minute1 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                    <text
                        textAnchor="middle"
                        x="701"
                        y="80"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="minute2 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                </svg>

                <svg
                    id="aksam"
                    className="aksam"
                    data-name="aksam"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 775.92 228.35"
                >
                    <defs>
                        <style type="text/css">
                            {`   @import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900");
                            @font-face {
                                font - family: "Hafs";
                            src: url("hafs.otf");
                            fontWeight: normal;
                       `}
                        </style>
                        <linearGradient
                            id="linear-gradient"
                            x1="2394.8"
                            y1="-1218.57"
                            x2="2394.72"
                            y2="-995.63"
                            gradientTransform="translate(-864.7 2404.26) rotate(-36.02)"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stopColor="#083640" />
                            <stop
                                offset="0.81"
                                stopColor="#083640"
                                stopOpacity="0"
                            />
                        </linearGradient>
                        <linearGradient
                            id="linear-gradient-2"
                            x1="276.3"
                            y1="70.18"
                            x2="422.55"
                            y2="70.18"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop id="stop1" offset="0" stopColor="#2c7291" />
                            <stop id="stop2" offset="1" stopColor="#1f5260" />
                        </linearGradient>
                    </defs>
                    <title>Artboard 7 copy</title>
                    <rect
                        id="s1"
                        fill="#2c7291"
                        x="386.98"
                        y="0.01"
                        width="388.94"
                        height="108.21"
                    />
                    <path
                        id="s2"
                        fill="url(#linear-gradient)"
                        d="M431,22.29h0A54.11,54.11,0,0,0,343.5,85.93h0l91.2,142.42,103.69-75.41Z"
                    />
                    <path
                        id="s3"
                        fill="url(#linear-gradient-2)"
                        d="M440.33,54.12c0-.91,0-1.81-.07-2.71,0-.18,0-.36,0-.55,0-.72-.09-1.44-.16-2.16,0-.18-.05-.36-.07-.54q-.11-1.08-.27-2.16c0-.14-.05-.27-.07-.41-.12-.77-.25-1.53-.41-2.29,0-.07,0-.14,0-.21A54.48,54.48,0,0,0,392.65.1c-.15,0-1.29,0-2.87.07C388.61.09,387.43,0,386.24,0a54.56,54.56,0,0,0-7.83.57h-.08l-.24,0-.18,0-83.84,12.8,25.62,126.85,86.72-35.78v0a54.58,54.58,0,0,0,31.45-34.19l.06-.22c.23-.72.43-1.44.62-2.17,0-.16.09-.32.13-.48.16-.65.31-1.3.45-2l.15-.69c.12-.6.22-1.2.32-1.8.05-.29.1-.57.14-.85.09-.57.15-1.15.22-1.72,0-.32.08-.63.11-1,.06-.58.1-1.16.13-1.75,0-.31.06-.62.07-.93,0-.83.06-1.66.06-2.5,0-.06,0-.13,0-.19Z"
                    />
                    <path
                        id="s4"
                        fill="#1f5260"
                        d="M294.51,13.49l41.11-3.6c-.7,0-41-.05-41.7-.05H66a66,66,0,0,0,0,132H293.92a65.77,65.77,0,0,0,27.35-5.94Z"
                    />
                    <path
                        id="s1"
                        fill="#2c7291"
                        d="M358.67,79.85a66.41,66.41,0,0,0-64.6-66.38v0H66.42a66.42,66.42,0,1,0,0,132.83c.39,0,.77,0,1.16,0H291.09c.39,0,.77,0,1.16,0l1.17,0h.65A66.41,66.41,0,0,0,358.67,79.85Z"
                    />
                    <text
                        id="tr"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        x="180"
                        y="85"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="bold"
                        className="text"
                        opacity="1"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        İKİNDİ
                    </text>
                    <text
                        id="ar"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        x="180"
                        y="85"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="bold"
                        className="text"
                        opacity="0"
                        style={{ fontFamily: "Hafs" }}
                    >
                        العصر
                    </text>
                    <text
                        id="de"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        x="180"
                        y="85"
                        fontSize="0.9em"
                        fill="white"
                        fontWeight="bold"
                        className="text"
                        opacity="0"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        NACHM.
                    </text>
                    <text
                        textAnchor="middle"
                        x="535"
                        y="80"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="hour1 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                    <text
                        textAnchor="middle"
                        x="582"
                        y="80"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="hour2 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                    <text
                        x="610"
                        y="75"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        :
                    </text>
                    <text
                        textAnchor="middle"
                        x="653"
                        y="80"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="minute1 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                    <text
                        textAnchor="middle"
                        x="701"
                        y="80"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="minute2 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                </svg>

                <svg
                    id="yatsi"
                    className="yatsi"
                    data-name="yatsi"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 775.92 228.35"
                >
                    <defs>
                        <style id="style">
                            {`
                            .cls-1 {
                                fill: #2c7291;
                        }

                            .cls-2 {
                                fill: url(#linear-gradient);
                        }

                            .cls-3 {
                                fill: url(#linear-gradient-2);
                        }

                            .cls-4 {
                                fill: #1f5260;
                        }
                            @import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900");
                            @font-face {
                                font - family: "Hafs";
                            src: url("hafs.otf");
                            fontWeight: normal;
                            }
                        `}
                        </style>
                        <linearGradient
                            id="linear-gradient"
                            x1="-2279.83"
                            y1="-2738.49"
                            x2="-2279.92"
                            y2="-2515.54"
                            gradientTransform="translate(3809.93 884.35) rotate(-36.02)"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stopColor="#083640" />
                            <stop
                                offset="0.81"
                                stopColor="#083640"
                                stopOpacity="0"
                            />
                        </linearGradient>
                        <linearGradient
                            id="linear-gradient-2"
                            x1="301.13"
                            y1="154.43"
                            x2="393.1"
                            y2="-4.85"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop id="stop1" offset="0" stopColor="#2c7291" />
                            <stop id="stop2" offset="1" stopColor="#1f5260" />
                        </linearGradient>
                    </defs>
                    <rect
                        id="s1"
                        fill="#2c7291"
                        x="386.98"
                        width="388.94"
                        height="108.21"
                    />
                    <path
                        id="s2"
                        fill="url(#linear-gradient)"
                        d="M431,22.29h0A54.11,54.11,0,0,0,343.5,85.93h0l91.2,142.42,103.69-75.41Z"
                    />
                    <path
                        id="s3"
                        fill="url(#linear-gradient-2)"
                        d="M441.09,54.11A54.1,54.1,0,0,0,358.26,8.26l0,0-100.61,65L339.19,176.4,424.3,93.27A54,54,0,0,0,441.09,54.11Z"
                    />
                    <path
                        id="s4"
                        fill="#1f5260"
                        d="M337,173.6a65.72,65.72,0,0,1-39.05,12.8H70a66,66,0,0,1,0-132H286.8L257.63,73.21Z"
                    />
                    <path
                        id="s1"
                        fill="#2c7291"
                        d="M293.92,62.37H66a66,66,0,0,0,0,132H293.92a66,66,0,0,0,0-132Z"
                    />
                    <text
                        id="tr"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        x="180"
                        y="135"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="bold"
                        className="text"
                        opacity="1"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        YATSI
                    </text>
                    <text
                        id="ar"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        x="180"
                        y="135"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="bold"
                        className="text"
                        opacity="0"
                        style={{ fontFamily: "Hafs" }}
                    >
                        العشاء
                    </text>
                    <text
                        id="de"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        x="180"
                        y="135"
                        fontSize="0.9em"
                        fill="white"
                        fontWeight="bold"
                        className="text"
                        opacity="0"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        NACHTS
                    </text>
                    <text
                        textAnchor="middle"
                        x="535"
                        y="80"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="hour1 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                    <text
                        textAnchor="middle"
                        x="582"
                        y="80"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="hour2 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                    <text
                        x="610"
                        y="75"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        :
                    </text>
                    <text
                        textAnchor="middle"
                        x="653"
                        y="80"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="minute1 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                    <text
                        textAnchor="middle"
                        x="701"
                        y="80"
                        fontSize="1.2em"
                        fill="white"
                        fontWeight="normal"
                        className="minute2 time"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        0
                    </text>
                </svg>
            </div>
        </>
    );
}

export default App;
