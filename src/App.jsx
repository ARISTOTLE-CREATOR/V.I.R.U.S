import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Hls from 'hls.js';
import { Menu, Tv, Search, Play, RotateCcw, Monitor, AlertCircle, Volume2, VolumeX, Pause, X, Radio, Wifi, ExternalLink, Youtube, Maximize, Minimize } from 'lucide-react';
import { parseMarkdownTable } from './utils/markdownParser';
import './App.css';

// Helper function to extract YouTube embed URL
const getYouTubeEmbedUrl = (url) => {
  // Handle various YouTube URL formats
  // https://www.youtube.com/watch?v=VIDEO_ID
  // https://www.youtube.com/c/CHANNEL/live
  // https://www.youtube.com/@CHANNEL/live
  // https://www.youtube.com/CHANNEL/live
  // https://youtu.be/VIDEO_ID

  let embedUrl = '';

  // Check for watch?v= format (direct video)
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) {
    embedUrl = `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1&mute=1&playsinline=1`;
    return embedUrl;
  }

  // Check for youtu.be short URL
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) {
    embedUrl = `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1&mute=1&playsinline=1`;
    return embedUrl;
  }

  // For channel live streams, we need to use a different approach
  // Extract channel name/id from URL patterns like:
  // /c/channelname/live, /@channelname/live, /channelname/live
  const liveMatch = url.match(/youtube\.com\/(c\/|@)?([^\/]+)\/live/i);
  if (liveMatch) {
    const channelName = liveMatch[2];
    // For live channel URLs, we'll use the channel embed with live parameter
    // This requires the channel's video ID which we don't have, so we return null
    // and handle it differently (open in new tab)
    return null; // Can't embed channel live streams directly
  }

  return null;
};

function App() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [playerError, setPlayerError] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  // Video player states
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const containerRef = useRef(null);

  // 1. Load Country List (Manifest)
  useEffect(() => {
    fetch('/channels/manifest.json')
      .then(res => res.json())
      .then(data => {
        setCountries(data);
        if (data.length > 0) setSelectedCountry(data[0]);
      })
      .catch(err => console.error("Manifest Error:", err));
  }, []);

  // 2. Load Channels when Country Changes
  useEffect(() => {
    if (!selectedCountry) return;

    setIsLoading(true);
    setChannels([]);
    setSearchQuery('');

    fetch(`https://raw.githubusercontent.com/Free-TV/IPTV/master/lists/${selectedCountry.file}`)
      .then(res => res.text())
      .then(text => {
        const parsed = parseMarkdownTable(text);
        setChannels(parsed);
        setIsLoading(false);

        // Auto-select first non-YouTube channel if available
        const firstHlsChannel = parsed.find(ch => !ch.isYoutube);
        if (firstHlsChannel) {
          handleChannelSelect(firstHlsChannel);
        } else if (parsed.length > 0) {
          handleChannelSelect(parsed[0]);
        } else {
          setActiveChannel(null);
        }
      })
      .catch(err => {
        console.error("Markdown Error:", err);
        setIsLoading(false);
      });
  }, [selectedCountry]);

  // 3. Initialize HLS player when channel changes (only for non-YouTube)
  useEffect(() => {
    if (!activeChannel || activeChannel.isYoutube) return;
    if (!videoRef.current) return;

    const video = videoRef.current;
    const url = activeChannel.url;

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setPlayerError(false);
    setIsBuffering(true);

    // Check if it's an HLS stream
    if (url.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          xhrSetup: (xhr) => {
            xhr.withCredentials = false;
          }
        });

        hls.loadSource(url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsBuffering(false);
          video.play().catch(console.error);
          setIsPlaying(true);
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.error('HLS Error:', data);
            setPlayerError(true);
            setIsBuffering(false);
          }
        });

        hlsRef.current = hls;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS support
        video.src = url;
        video.addEventListener('loadedmetadata', () => {
          setIsBuffering(false);
          video.play().catch(console.error);
          setIsPlaying(true);
        });
      }
    } else {
      // Regular video file
      video.src = url;
      video.addEventListener('loadeddata', () => {
        setIsBuffering(false);
        video.play().catch(console.error);
        setIsPlaying(true);
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeChannel]);

  // Video event handlers (for non-YouTube)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleError = () => {
      console.error('Video Error');
      setPlayerError(true);
      setIsBuffering(false);
    };

    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
    };
  }, []);

  const handleChannelSelect = useCallback((channel) => {
    console.log("Selected:", channel.name, channel.isYoutube ? "(YouTube)" : "(HLS)");
    setPlayerError(false);
    setActiveChannel(channel);
    setIsPlaying(true);
    setIsBuffering(false);
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current && activeChannel && !activeChannel.isYoutube) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current && activeChannel && !activeChannel.isYoutube) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const retryConnection = () => {
    if (activeChannel) {
      const temp = activeChannel;
      setActiveChannel(null);
      setTimeout(() => {
        setActiveChannel(temp);
      }, 100);
    }
  };

  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Get YouTube embed URL for the current channel
  const youtubeEmbedUrl = useMemo(() => {
    if (activeChannel?.isYoutube) {
      return getYouTubeEmbedUrl(activeChannel.url);
    }
    return null;
  }, [activeChannel]);

  // Filter Channels based on Search
  const filteredChannels = useMemo(() => {
    if (!searchQuery) return channels;
    return channels.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [channels, searchQuery]);

  // Group Channels by Category
  const groupedChannels = useMemo(() => {
    const groups = {};
    filteredChannels.forEach(ch => {
      if (!groups[ch.category]) groups[ch.category] = [];
      groups[ch.category].push(ch);
    });
    return groups;
  }, [filteredChannels]);

  // Render player content based on channel type
  const renderPlayer = () => {
    if (!activeChannel) {
      return (
        <div className="no-channel-overlay">
          <div className="no-channel-content">
            <div className="no-channel-icon">
              <Monitor size={48} />
            </div>
            <h3>Welcome to V.I.R.U.S</h3>
            <p>Select a channel from the list below to start watching</p>
          </div>
        </div>
      );
    }

    if (playerError) {
      return (
        <div className="error-overlay">
          <div className="error-content">
            <div className="error-icon">
              <AlertCircle size={40} />
            </div>
            <h3>Stream Unavailable</h3>
            <p>This channel is currently offline or restricted.</p>
            <button onClick={retryConnection} className="retry-button">
              <RotateCcw size={16} />
              <span>Retry Connection</span>
            </button>
          </div>
        </div>
      );
    }

    // YouTube channel handling
    if (activeChannel.isYoutube) {
      if (youtubeEmbedUrl) {
        // Embeddable YouTube video
        return (
          <div className="video-wrapper">
            <iframe
              src={youtubeEmbedUrl}
              className="youtube-player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={activeChannel.name}
            />
          </div>
        );
      } else {
        // YouTube live channel (can't be embedded directly)
        return (
          <div className="youtube-external-overlay">
            <div className="youtube-external-content">
              <div className="youtube-icon">
                <Youtube size={48} />
              </div>
              <h3>{activeChannel.name}</h3>
              <p>This YouTube live stream needs to be opened in a new tab</p>
              <button
                onClick={() => openInNewTab(activeChannel.url)}
                className="open-youtube-btn"
              >
                <ExternalLink size={18} />
                <span>Watch on YouTube</span>
              </button>
            </div>
          </div>
        );
      }
    }

    // HLS/Regular video player
    return (
      <div className="video-wrapper" ref={containerRef}>
        <video
          ref={videoRef}
          className="video-player"
          playsInline
          muted={isMuted}
          autoPlay
          onClick={togglePlay}
        />

        {/* Buffering Indicator */}
        {isBuffering && (
          <div className="buffering-overlay">
            <div className="buffering-spinner" />
            <span>Loading stream...</span>
          </div>
        )}

        {/* Video Controls Overlay */}
        <div className="video-controls">
          <div className="controls-left">
            <button onClick={togglePlay} className="control-btn play-btn">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <button onClick={toggleMute} className="control-btn mute-btn">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              {isMuted && <span className="unmute-hint">Tap to unmute</span>}
            </button>
          </div>

          <div className="controls-right">
            <button onClick={toggleFullscreen} className="control-btn fullscreen-btn">
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Mobile Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">
              <Tv size={18} />
            </div>
            <h1 className="logo-text">V.I.R.U.S</h1>
          </div>
          <button
            className="close-sidebar-btn"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-section-title">
            <Radio size={12} />
            <span>Countries</span>
          </div>

          <div className="country-list">
            {countries.map(country => (
              <button
                key={country.id}
                onClick={() => {
                  setSelectedCountry(country);
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`country-button ${selectedCountry?.id === country.id ? 'active' : ''}`}
              >
                <img
                  src={`https://flagcdn.com/24x18/${country.code}.png`}
                  className="country-flag"
                  alt={country.name}
                  onError={(e) => e.target.style.display = 'none'}
                />
                <span className="country-name">{country.name}</span>
                {selectedCountry?.id === country.id && (
                  <span className="active-indicator" />
                )}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="menu-button"
            >
              <Menu size={22} />
            </button>

            <div className="current-channel-info">
              <div className="live-badge">
                <span className="live-dot" />
                <span>LIVE</span>
                {activeChannel?.isYoutube && (
                  <span className="yt-live-badge">
                    <Youtube size={10} />
                    YT
                  </span>
                )}
              </div>
              <span className="channel-name">
                {activeChannel ? activeChannel.name : 'Select a channel'}
              </span>
            </div>
          </div>

          <div className="search-container desktop-only">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="header-right">
            <div className="connection-status">
              <Wifi size={14} />
            </div>
          </div>
        </header>

        {/* Video Player */}
        <div className="player-section" ref={containerRef}>
          {renderPlayer()}
        </div>

        {/* Channel Grid */}
        <div className="channel-section">
          {/* Mobile Search */}
          <div className="mobile-search">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              <span>Loading channels...</span>
            </div>
          ) : (
            <div className="channel-grid-container">
              {Object.keys(groupedChannels).length === 0 && (
                <div className="no-results">
                  <p>No channels found</p>
                </div>
              )}

              {Object.entries(groupedChannels).map(([category, chans]) => (
                <div key={category} className="category-section">
                  <h3 className="category-title">
                    <span className="category-accent" />
                    {category}
                    <span className="channel-count">{chans.length}</span>
                  </h3>

                  <div className="channel-grid">
                    {chans.map((channel, idx) => (
                      <div
                        key={`${channel.id}-${idx}`}
                        onClick={() => handleChannelSelect(channel)}
                        className={`channel-card ${activeChannel?.url === channel.url ? 'active' : ''} ${channel.isYoutube ? 'youtube' : ''}`}
                      >
                        <div className="channel-logo">
                          {channel.logo ? (
                            <img
                              src={channel.logo}
                              alt={channel.name}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <span className="logo-fallback" style={{ display: channel.logo ? 'none' : 'flex' }}>
                            {channel.name.charAt(0)}
                          </span>
                        </div>

                        <div className="channel-info">
                          <h4 className="channel-title">{channel.name}</h4>
                          <div className="channel-meta">
                            {channel.isYoutube && (
                              <span className="yt-badge">
                                <Youtube size={8} />
                                YT
                              </span>
                            )}
                            <span className="channel-id">#{channel.id}</span>
                          </div>
                        </div>

                        <div className="play-indicator">
                          {channel.isYoutube ? (
                            <Youtube size={14} />
                          ) : (
                            <Play size={14} fill="currentColor" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;