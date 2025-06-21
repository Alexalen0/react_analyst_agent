import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  createTheme,
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import Plot from "react-plotly.js";
import { useMediaQuery } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DataObjectIcon from "@mui/icons-material/DataObject";
import { processFile } from "./services/fileProcessor";
import { queryLLama } from "./services/api";
import { FileContent } from "./types";
import { animated, useSpring, useTrail, config } from "react-spring";

// Enhanced theme with modern color palette and glassmorphism
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6366f1", // Modern indigo
      light: "#818cf8",
      dark: "#4f46e5",
    },
    secondary: {
      main: "#ec4899", // Vibrant pink
      light: "#f472b6",
      dark: "#db2777",
    },
    background: {
      default: "#0f0f23",
      paper: "rgba(15, 15, 35, 0.8)",
    },
    text: {
      primary: "#f8fafc",
      secondary: "#cbd5e1",
    },
  },
  typography: {
    fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
    h1: {
      fontWeight: 800,
      fontSize: "3.5rem",
      background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    h4: { fontWeight: 700, letterSpacing: "-0.02em" },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          background: "rgba(15, 15, 35, 0.6)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          textTransform: "none",
          fontWeight: 600,
          padding: "12px 32px",
          background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
          boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
    },
  },
});

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const isMobile = useMediaQuery("(max-width:600px)");

  // Scroll tracking for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hero text animation
  const heroTextTrail = useTrail(3, {
    from: { opacity: 0, transform: "translateY(100px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: config.slow,
  });

  // Main card animation
  const mainCardSpring = useSpring({
    from: { opacity: 0, transform: "translateY(100px) scale(0.9)" },
    to: { opacity: 1, transform: "translateY(0px) scale(1)" },
    delay: 800,
    config: config.gentle,
  });

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const content = await processFile(file);
      setFileContent({
        type: file.name.split(".").pop()?.toLowerCase() || "",
        content,
        preview: Array.isArray(content)
          ? content.slice(0, 5)
          : content.substring(0, 1000),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
    setLoading(false);
  };

  const handleAnalysis = async () => {
    if (!fileContent || !apiKey || !query) return;

    setLoading(true);
    setError(null);
    try {
      const prompt = `You are a professional data analyst. Based on the following ${
        fileContent.type === "csv" || fileContent.type === "xlsx"
          ? "data"
          : "text"
      }, answer the question:\n\n${
        Array.isArray(fileContent.content)
          ? JSON.stringify(fileContent.content.slice(0, 100))
          : fileContent.content
      }\n\nQuestion: ${query}`;

      const response = await queryLLama(prompt, apiKey);
      setAnswer(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "#0f0f23",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/*  Background */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
          }}
        />

        {/* Modern App Bar */}
        <AppBar
          position="fixed"
          sx={{
            background: "rgba(15, 15, 35, 0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "none",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              sx={{ flexGrow: 1, fontWeight: 700 }}
            >
              AI Data Analyst
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Enhanced Drawer */}
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: {
              background: "rgba(15, 15, 35, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#fff",
              width: 320,
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main" }}
            >
              🚀 Configuration
            </Typography>
            <TextField
              fullWidth
              type="password"
              label="Together.ai API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              margin="normal"
              sx={{
                "& .MuiOutlinedInput-root": {
                  background: "rgba(255, 255, 255, 0.05)",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.2)" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                  "&.Mui-focused fieldset": { borderColor: "primary.main" },
                },
                "& .MuiInputLabel-root": { color: "text.secondary" },
                "& .MuiInputBase-input": { color: "text.primary" },
              }}
            />
          </Box>
        </Drawer>

        {/* Hero Section with Parallax */}
        <Container
          maxWidth="lg"
          sx={{ pt: 15, pb: 8, position: "relative", zIndex: 1 }}
        >
          <Box sx={{ textAlign: "center", mb: 8 }}>
            {heroTextTrail.map((style, index) => (
              <animated.div key={index} style={style}>
                {index === 0 && (
                  <Typography variant="h1" sx={{ mb: 2 }}>
                    Next-Gen Data Analysis
                  </Typography>
                )}
                {index === 1 && (
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 4,
                      color: "text.secondary",
                      maxWidth: 600,
                      mx: "auto",
                    }}
                  >
                    Transform your data into actionable insights with AI-powered
                    analysis and stunning visualizations
                  </Typography>
                )}
                {index === 2 && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<AutoAwesomeIcon />}
                      sx={{ minWidth: 180 }}
                    >
                      Get Started
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        minWidth: 180,
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        color: "text.primary",
                        "&:hover": {
                          borderColor: "primary.main",
                          background: "rgba(99, 102, 241, 0.1)",
                        },
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                )}
              </animated.div>
            ))}
          </Box>

          {/* Main Analysis Card */}
          <animated.div style={mainCardSpring}>
            <Paper
              sx={{
                p: 3,
                background: "rgba(15, 15, 35, 0.6)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)",
                },
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{ mb: 4, textAlign: "center" }}
              >
                Upload & Analyze Your Data
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  size="large"
                  sx={{
                    minWidth: 200,
                    height: 56,
                    fontSize: "1.1rem",
                  }}
                >
                  Choose File
                  <input
                    type="file"
                    hidden
                    onChange={handleFileUpload}
                    accept=".txt,.docx,.pdf,.csv,.xlsx,.png,.jpg,.jpeg"
                  />
                </Button>
              </Box>

              {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", m: 4 }}>
                  <CircularProgress size={60} thickness={4} />
                </Box>
              )}

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    my: 3,
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    color: "#fca5a5",
                  }}
                >
                  {error}
                </Alert>
              )}

              {fileContent && (
                <div>
                  <Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ mt: 4, color: "primary.main" }}
                    >
                      📄 File Preview
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 3,
                        my: 3,
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: 3,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.9rem",
                        maxHeight: 300,
                        overflow: "auto",
                      }}
                    >
                      <pre
                        style={{
                          whiteSpace: "pre-wrap",
                          margin: 0,
                          color: "#cbd5e1",
                        }}
                      >
                        {JSON.stringify(fileContent.preview, null, 2)}
                      </pre>
                    </Paper>

                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Ask a question about your data"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      sx={{
                        my: 3,
                        "& .MuiOutlinedInput-root": {
                          background: "rgba(255, 255, 255, 0.02)",
                          "& fieldset": {
                            borderColor: "rgba(255, 255, 255, 0.2)",
                          },
                          "&:hover fieldset": { borderColor: "primary.main" },
                          "&.Mui-focused fieldset": {
                            borderColor: "primary.main",
                          },
                        },
                        "& .MuiInputLabel-root": { color: "text.secondary" },
                        "& .MuiInputBase-input": { color: "text.primary" },
                      }}
                    />

                    <Button
                      variant="contained"
                      onClick={handleAnalysis}
                      disabled={!apiKey || loading}
                      size="large"
                      sx={{ my: 2, minWidth: 150 }}
                    >
                      {loading ? "Analyzing..." : "Analyze Data"}
                    </Button>

                    {answer && (
                      <div>
                        <Paper
                          sx={{
                            p: 4,
                            my: 4,
                            background: "rgba(99, 102, 241, 0.05)",
                            border: "1px solid rgba(99, 102, 241, 0.2)",
                            borderRadius: 3,
                          }}
                        >
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ color: "primary.main" }}
                          >
                            🧠 AI Analysis Result
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ lineHeight: 1.7, color: "text.primary" }}
                          >
                            {answer}
                          </Typography>
                        </Paper>
                      </div>
                    )}

                    {/* Enhanced Visualizations */}
                    {(fileContent.type === "csv" ||
                      fileContent.type === "xlsx") && (
                      <Box sx={{ mt: 6 }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            color: "secondary.main",
                            textAlign: "center",
                            mb: 4,
                            fontSize: "1.5rem",
                            fontWeight: 700,
                          }}
                        >
                          📊 Interactive Data Visualizations
                        </Typography>

                        {Array.isArray(fileContent.preview) &&
                          fileContent.preview[0] &&
                          Object.keys(fileContent.preview[0])
                            .slice(0, 3)
                            .map((column, index) => {
                              const columnData = Array.isArray(
                                fileContent.content
                              )
                                ? fileContent.content
                                    .map((row: any) => row[column])
                                    .filter((val) => val != null)
                                : [];

                              const isNumeric = columnData.every(
                                (val) => !isNaN(Number(val))
                              );

                              return (
                                <Box
                                  key={column}
                                  sx={{
                                    mb: 6,
                                    p: 3,
                                    background: "rgba(15, 15, 35, 0.4)",
                                    borderRadius: 4,
                                    border:
                                      "1px solid rgba(255, 255, 255, 0.1)",
                                    backdropFilter: "blur(10px)",
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      mb: 3,
                                      color: "primary.light",
                                      textAlign: "center",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {column.charAt(0).toUpperCase() +
                                      column.slice(1)}{" "}
                                    Distribution
                                  </Typography>

                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                      width: "100%",
                                      "& .plotly": {
                                        width: "100% !important",
                                        height: "auto !important",
                                      },
                                    }}
                                  >
                                    <Plot
                                      data={[
                                        {
                                          type: isNumeric ? "histogram" : "bar",
                                          x: isNumeric
                                            ? columnData.map(Number)
                                            : columnData,
                                          y: !isNumeric
                                            ? columnData.reduce(
                                                (acc: any, val: any) => {
                                                  acc[val] =
                                                    (acc[val] || 0) + 1;
                                                  return acc;
                                                },
                                                {}
                                              )
                                            : undefined,
                                          name: column,
                                          marker: {
                                            color:
                                              index === 0
                                                ? "#6366f1"
                                                : index === 1
                                                ? "#ec4899"
                                                : "#14b8a6",
                                            line: {
                                              color:
                                                index === 0
                                                  ? "#4f46e5"
                                                  : index === 1
                                                  ? "#db2777"
                                                  : "#0f766e",
                                              width: 2,
                                            },
                                            opacity: 0.8,
                                          },
                                          hovertemplate: isNumeric
                                            ? "<b>%{x}</b><br>Count: %{y}<extra></extra>"
                                            : "<b>%{x}</b><br>Count: %{y}<extra></extra>",
                                        },
                                      ]}
                                      layout={{
                                        title: {
                                          text: `${column} Analysis`,
                                          font: {
                                            color: "#f8fafc",
                                            size: 18,
                                            family: "Inter, sans-serif",
                                          },
                                          x: 0.5,
                                          xanchor: "center",
                                        },
                                        autosize: true,
                                        margin: { l: 60, r: 60, t: 80, b: 60 },
                                        paper_bgcolor: "rgba(15, 15, 35, 0.0)",
                                        plot_bgcolor: "rgba(15, 15, 35, 0.0)",
                                        font: {
                                          family: "Inter, sans-serif",
                                          color: "#cbd5e1",
                                          size: 12,
                                        },
                                        xaxis: {
                                          gridcolor: "rgba(255, 255, 255, 0.1)",
                                          linecolor: "rgba(255, 255, 255, 0.2)",
                                          tickcolor: "rgba(255, 255, 255, 0.2)",
                                          title: {
                                            text: column,
                                            font: {
                                              color: "#f8fafc",
                                              size: 14,
                                            },
                                          },
                                          showgrid: true,
                                          zeroline: false,
                                        },
                                        yaxis: {
                                          gridcolor: "rgba(255, 255, 255, 0.1)",
                                          linecolor: "rgba(255, 255, 255, 0.2)",
                                          tickcolor: "rgba(255, 255, 255, 0.2)",
                                          title: {
                                            text: "Count",
                                            font: {
                                              color: "#f8fafc",
                                              size: 14,
                                            },
                                          },
                                          showgrid: true,
                                          zeroline: false,
                                        },
                                        hoverlabel: {
                                          bgcolor: "rgba(15, 15, 35, 0.9)",
                                          bordercolor:
                                            "rgba(99, 102, 241, 0.5)",
                                          font: { color: "#f8fafc" },
                                        },
                                        showlegend: false,
                                      }}
                                      config={{
                                        displayModeBar: false,
                                        responsive: true,
                                      }}
                                      useResizeHandler={true}
                                      style={{
                                        width: "100%",
                                        height: "450px",
                                      }}
                                    />
                                  </Box>

                                  {/* Add summary statistics */}
                                  {isNumeric && columnData.length > 0 && (
                                    <Box
                                      sx={{
                                        mt: 3,
                                        p: 2,
                                        background: "rgba(99, 102, 241, 0.05)",
                                        borderRadius: 2,
                                        border:
                                          "1px solid rgba(99, 102, 241, 0.2)",
                                      }}
                                    >
                                      <Typography
                                        variant="subtitle2"
                                        sx={{ color: "primary.light", mb: 1 }}
                                      >
                                        📈 Quick Stats
                                      </Typography>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          gap: 3,
                                          flexWrap: "wrap",
                                        }}
                                      >
                                        <Typography
                                          variant="body2"
                                          sx={{ color: "text.secondary" }}
                                        >
                                          <strong>Mean:</strong>{" "}
                                          {(
                                            columnData.reduce(
                                              (a, b) => Number(a) + Number(b),
                                              0
                                            ) / columnData.length
                                          ).toFixed(2)}
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          sx={{ color: "text.secondary" }}
                                        >
                                          <strong>Min:</strong>{" "}
                                          {Math.min(
                                            ...columnData.map(Number)
                                          ).toFixed(2)}
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          sx={{ color: "text.secondary" }}
                                        >
                                          <strong>Max:</strong>{" "}
                                          {Math.max(
                                            ...columnData.map(Number)
                                          ).toFixed(2)}
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          sx={{ color: "text.secondary" }}
                                        >
                                          <strong>Count:</strong>{" "}
                                          {columnData.length}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  )}
                                </Box>
                              );
                            })}
                      </Box>
                    )}
                  </Box>
                </div>
              )}
            </Paper>
          </animated.div>
        </Container>

        {/* Footer with gradient */}
        {/* <Box
          sx={{
            mt: 8,
            py: 4,
            textAlign: "center",
            background:
              "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            © {new Date().getFullYear()} AI Data Analyst • Powered by
            cutting-edge technology
          </Typography>
        </Box> */}
      </Box>
    </ThemeProvider>
  );
}

export default App;
