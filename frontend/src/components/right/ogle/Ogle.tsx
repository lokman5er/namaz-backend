import "./Ogle.css";

function Ogle() {
    return (
        <>
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
        </>
    );
}

export default Ogle;
