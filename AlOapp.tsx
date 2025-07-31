import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Map, Calendar, Users, Settings, MessageCircle, AlertTriangle, Gift, Clock, Music } from 'lucide-react';

const ALOApp = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [notifications, setNotifications] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [bubbleNotifications, setBubbleNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'festival-search', 'festival-detail'
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [pinnedPerformers, setPinnedPerformers] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: 40.7128, lng: -74.0060 }); // NYC default

  // Mock festival data
  const festivals = [
    {
      id: 1,
      name: "Desert Dreams Festival",
      location: "Nevada",
      distance: "2.1 miles",
      date: "Aug 15-17, 2025",
      performers: [
        { 
          id: 1, 
          name: "Sunset Vibes", 
          stage: "Main Stage", 
          time: "7:30 PM", 
          timeLeft: "2h 15m",
          genre: "Indie Folk",
          description: "An ethereal indie folk band known for their dreamy harmonies and acoustic storytelling that captures the magic of golden hour."
        },
        { 
          id: 2, 
          name: "Midnight Groove", 
          stage: "Electronic Tent", 
          time: "9:00 PM", 
          timeLeft: "3h 45m",
          genre: "Deep House",
          description: "A dynamic DJ duo that blends deep house with desert vibes, creating hypnotic beats perfect for late-night dancing under the stars."
        },
        { 
          id: 3, 
          name: "Cosmic Journey", 
          stage: "Acoustic Garden", 
          time: "10:30 PM", 
          timeLeft: "5h 15m",
          genre: "Psychedelic Rock",
          description: "A transcendent psychedelic rock collective that takes audiences on sonic adventures through space and consciousness."
        },
        { 
          id: 4, 
          name: "Desert Winds", 
          stage: "Main Stage", 
          time: "11:45 PM", 
          timeLeft: "6h 30m",
          genre: "World Fusion",
          description: "An experimental world fusion ensemble that weaves together traditional desert instruments with modern electronic elements."
        }
      ]
    },
    {
      id: 2,
      name: "Urban Beats Fest",
      location: "Brooklyn, NY",
      distance: "0.8 miles",
      date: "Aug 22-24, 2025",
      performers: [
        { 
          id: 5, 
          name: "City Lights", 
          stage: "Main Stage", 
          time: "6:00 PM", 
          timeLeft: "50m",
          genre: "Alternative Hip-Hop",
          description: "Rising alternative hip-hop artists who paint vivid urban landscapes through clever wordplay and atmospheric production."
        },
        { 
          id: 6, 
          name: "Underground Collective", 
          stage: "Warehouse Stage", 
          time: "8:15 PM", 
          timeLeft: "3h 5m",
          genre: "Techno",
          description: "A legendary techno collective that emerged from Brooklyn's warehouse scene, delivering raw industrial beats with underground authenticity."
        }
      ]
    }
  ];

  const findNearestFestival = () => {
    // Simulate GPS functionality
    const nearest = festivals.reduce((prev, curr) => 
      parseFloat(prev.distance) < parseFloat(curr.distance) ? prev : curr
    );
    setSelectedFestival(nearest);
    setCurrentPage('festival-detail');
  };

  const togglePinPerformer = useCallback((performer) => {
    setPinnedPerformers(prev => {
      const isAlreadyPinned = prev.some(p => p.id === performer.id);
      if (isAlreadyPinned) {
        return prev.filter(p => p.id !== performer.id);
      } else {
        // Simulate setting alert - only when in festival detail page
        if (currentPage === 'festival-detail') {
          setTimeout(() => {
            setBubbleNotifications(prevBubbles => [...prevBubbles, {
              id: Date.now(),
              text: `📌 ${performer.name} starts in 15 minutes!`,
              type: "alert",
              icon: Bell
            }]);
          }, 2000); // Demo alert after 2 seconds
        }
        return [...prev, performer];
      }
    });
  }, [currentPage]);

  const findClosestEats = () => {
    if (currentPage === 'festival-detail') {
      setBubbleNotifications(prev => [...prev, {
        id: Date.now(),
        text: "🍕 Closest food: Pizza Paradise - 0.1 miles north",
        type: "location",
        icon: Map
      }]);
    }
  };

  const findClosestBathrooms = () => {
    if (currentPage === 'festival-detail') {
      setBubbleNotifications(prev => [...prev, {
        id: Date.now(),
        text: "🚻 Nearest restrooms: Behind Main Stage - 0.05 miles",
        type: "location", 
        icon: Map
      }]);
    }
  };

  // Simulate notifications appearing as bubbles - only when festival is selected
  useEffect(() => {
    if (currentPage !== 'festival-detail' || !selectedFestival) return;

    const notificationTypes = [
      { text: "🎁 Free ALO merchandise at Main Stage in 15 min!", type: "giveaway", icon: Gift },
      { text: "⏰ Midnight Groove delayed by 20 minutes", type: "delay", icon: Clock },
      { text: "🎵 Similar artist to your favorites performing at Sunset Stage!", type: "discovery", icon: Music }
    ];

    const timeouts = new Set<number>();

    const showBubble = () => {
      const randomNotif = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
      const id = Date.now();
      const newBubble = { ...randomNotif, id };
      
      setBubbleNotifications(prev => [...prev, newBubble]);
      
      // Remove bubble after animation
      const timeoutId = setTimeout(() => {
        setBubbleNotifications(prev => prev.filter(b => b.id !== id));
        timeouts.delete(timeoutId);
      }, 4000);
      
      timeouts.add(timeoutId);
    };

    const interval = setInterval(showBubble, 8000);
    
    return () => {
      clearInterval(interval);
      // Clear all pending timeouts
      timeouts.forEach(timeoutId => clearTimeout(timeoutId));
      timeouts.clear();
      // Clear bubble notifications when leaving the page
      setBubbleNotifications([]);
    };
  }, [currentPage, selectedFestival]);

  const handleFeedbackSubmit = () => {
    alert('Thank you for your feedback! We appreciate your input.');
    setFeedbackText('');
    setShowFeedback(false);
  };

  const FestivalSilhouette = () => (
    <div className="relative w-64 h-64 mx-auto mb-8 rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-300">
      <img 
        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxkZWZzPgo8cmFkaWFsR3JhZGllbnQgaWQ9InN0YWdlR3JhZGllbnQiIGN4PSIwLjUiIGN5PSIwLjUiIHI9IjAuNSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkQ3MDAiIHN0b3Atb3BhY2l0eT0iMC45Ii8+CjxzdG9wIG9mZnNldD0iMzAlIiBzdG9wLWNvbG9yPSIjRkZBNTAwIiBzdG9wLW9wYWNpdHk9IjAuOCIvPgo8c3RvcCBvZmZzZXQ9IjYwJSIgc3RvcC1jb2xvcj0iI0ZGNjkwMCIgc3RvcC1vcGFjaXR5PSIwLjciLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkY0NTAwIiBzdG9wLW9wYWNpdHk9IjAuNiIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8bGluZWFyR3JhZGllbnQgaWQ9ImNyb3dkR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzFFMTcxMSIgc3RvcC1vcGFjaXR5PSIxIi8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzQ0MzAyNSIgc3RvcC1vcGFjaXR5PSIxIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KCjwhLS0gQ29uY2VudHJpYyBjaXJjbGVzIGZvciBzdGFnZSBiYWNrZ3JvdW5kIC0tPgo8Y2lyY2xlIGN4PSIyNTAiIGN5PSIyNTAiIHI9IjI0MCIgZmlsbD0idXJsKCNzdGFnZUdyYWRpZW50KSIvPgo8Y2lyY2xlIGN4PSIyNTAiIGN5PSIyNTAiIHI9IjIwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZENzAwIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuNiIvPgo8Y2lyY2xlIGN4PSIyNTAiIGN5PSIyNTAiIHI9IjE2MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZBNTAwIiBzdHJva2Utd2lkdGg9IjMiIG9wYWNpdHk9IjAuNyIvPgo8Y2lyY2xlIGN4PSIyNTAiIGN5PSIyNTAiIHI9IjEyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkY4QzAwIiBzdHJva2Utd2lkdGg9IjQiIG9wYWNpdHk9IjAuOCIvPgo8Y2lyY2xlIGN4PSIyNTAiIGN5PSIyNTAiIHI9IjgwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iNSIgb3BhY2l0eT0iMC45Ii8+Cgo8IS0tIENyb3dkIHNpbGhvdWV0dGVzIC0tPgo8ZyBmaWxsPSJ1cmwoI2Nyb3dkR3JhZGllbnQpIj4KICA8IS0tIENlbnRlciBncm91cCAtLT4KICA8cGF0aCBkPSJNMjQwIDQwMCBRMjM1IDM4MCAyNDUgMzc1IFEyNTAgMzg1IDI1NSA0MDAgTDI1NSA1MDAgTDI0MCA1MDAgWiIvPgogIDxwYXRoIGQ9Ik0yNTUgNDAwIFEyNTAgMzc4IDI2MCAzNzMgUTI2NSAzODMgMjcwIDQwMCBMMjcwIDUwMCBMMjU1IDUwMCBaIi8+CiAgPCEtLSBMZWZ0IGdyb3VwIC0tPgogIDxwYXRoIGQ9Ik0xODAgNDEwIFExNzUgMzg1IDE4NSAzODAgUTE5MCAzOTAgMTk1IDQxMCBMMTk1IDUwMCBMMTgwIDUwMCBaIi8+CiAgPHBhdGggZD0iTTIwMCA0MDUgUTE5NSAzODMgMjA1IDM3OCBRMjEwIDM4OCAyMTUgNDA1IEwyMTUgNTAwIEwyMDAgNTAwIFoiLz4KICA8cGF0aCBkPSJNMjIwIDQxNSBRMjE1IDM5NSAyMjUgMzkwIFEyMzAgNDAwIDIzNSA0MTUgTDIzNSA1MDAgTDIyMCA1MDAgWiIvPgogIDwhLS0gUmlnaHQgZ3JvdXAgLS0+CiAgPHBhdGggZD0iTTI3NSA0MDUgUTI3MCAzODIgMjgwIDM3NyBRMjg1IDM4NyAyOTAgNDA1IEwyOTAgNTAwIEwyNzUgNTAwIFoiLz4KICA8cGF0aCBkPSJNMjk1IDQxMCBRMjkwIDM4OCAzMDAgMzgzIFEzMDUgMzkzIDMxMCA0MTAgTDMxMCA1MDAgTDI5NSA1MDAgWiIvPgogIDxwYXRoIGQ9Ik0zMTUgNDA4IFEzMTAgMzg2IDMyMCAzODEgUTMyNSAzOTEgMzMwIDQwOCBMMzMwIDUwMCBMMzE1IDUwMCBaIi8+CiAgCiAgPCEtLSBBcm1zIHJhaXNlZCAtLT4KICA8Y2lyY2xlIGN4PSIyNDciIGN5PSIzNzIiIHI9IjQiLz4KICA8cGF0aCBkPSJNMjQ3IDM3NiBMMjQyIDM2MCBNMjQ3IDM3NiBMMjUyIDM2MCIgc3Ryb2tlPSJ1cmwoI2Nyb3dkR3JhZGllbnQpIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz4KICA8Y2lyY2xlIGN4PSIyNjIiIGN5PSIzNzAiIHI9IjQiLz4KICA8cGF0aCBkPSJNMjYyIDM3NCBMMJM3IDM1OCBNMjYyIDM3NCBMMJY3IDM1OCIgc3Ryb2tlPSJ1cmwoI2Nyb3dkR3JhZGllbnQpIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiLz4KICA8Y2lyY2xlIGN4PSIxODciIGN5PSIzNzciIHI9IjQiLz4KICA8cGF0aCBkPSJNMTg3IDM4MSBMMTM4MiAzNjUgTTE4NyAzODEgTDE5MiAzNjUiIHN0cm9rZT0idXJsKCNjcm93ZEdyYWRpZW50KSIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+CiAgPGNpcmNsZSBjeD0iMjA3IiBjeT0iMzc1IiByPSI0Ii8+CiAgPHBhdGggZD0iTTIwNyAzNzkgTDIwMiAzNjMgTTIwNyAzNzkgTDIxMiAzNjMiIHN0cm9rZT0idXJsKCNjcm93ZEdyYWRpZW50KSIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+CiAgPGNpcmNsZSBjeD0iMzAyIiBjeT0iMzgwIiByPSI0Ii8+CiAgPHBhdGggZD0iTTMwMiAzODQgTDI5NyAzNjggTTMwMiAzODQgTDMwNyAzNjgiIHN0cm9rZT0idXJsKCNjcm93ZEdyYWRpZW50KSIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+CiAgPGNpcmNsZSBjeD0iMzIyIiBjeT0iMzc4IiByPSI0Ii8+CiAgPHBhdGggZD0iTTMyMiAzODIgTDMxNyAzNjYgTTMyMiAzODIgTDMyNyAzNjYiIHN0cm9rZT0idXJsKCNjcm93ZEdyYWRpZW50KSIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIi8+CjwvZz4KCjwhLS0gU3RhZ2UgbGlnaHRzIC0tPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIzMDAiIHI9IjYiIGZpbGw9IiNGRkQ3MDAiIG9wYWNpdHk9IjAuOSI+CiAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgdmFsdWVzPSIwLjk7MC41OzAuOSIgZHVyPSIyLjVzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPgo8L2NpcmNsZT4KPGNpcmNsZSBjeD0iMjUwIiBjeT0iMjgwIiByPSI4IiBmaWxsPSIjRkY2OTAwIiBvcGFjaXR5PSIwLjkiPgogIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMC45OzAuNDswLjkiIGR1cj0iMy4yIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPgo8L2NpcmNsZT4KPGNpcmNsZSBjeD0iMzAwIiBjeT0iMzAwIiByPSI2IiBmaWxsPSIjRkZENzAwIiBvcGFjaXR5PSIwLjkiPgogIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIHZhbHVlcz0iMC45OzAuNjswLjkiIGR1cj0iMS44cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz4KPC9jaXJjbGU+Cgo8IS0tIERlY29yYXRpdmUgZWxlbWVudHMgLS0+CjxwYXRoIGQ9Ik0xMDAgMTAwIFExNTAgOTAgMjAwIDEwMCBRMjUwIDkwIDMwMCAxMDAgUTM1MCA5MCA0MDAgMTAwIiBzdHJva2U9IiNGRkQ3MDAiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIgb3BhY2l0eT0iMC41Ii8+CjxwYXRoIGQ9Ik05MCAyMDAgUTE0MCAyMTAgMTkwIDIwMCBRMjUwIDIxMCAzMTAgMjAwIFEzNjAgMjEwIDQxMCAyMDAiIHN0cm9rZT0iI0ZGQTU0MCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjQiLz4KPC9zdmc+"
        alt="Festival Silhouette"
        className="w-full h-full object-cover"
        style={{
          filter: 'sepia(100%) saturate(200%) hue-rotate(20deg) brightness(1.1) contrast(1.2)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 via-transparent to-transparent"></div>
    </div>
  );

  const BubbleNotification = ({ notification, index }) => (
    <div 
      key={notification.id}
      className="fixed z-50 bubble-animation"
      style={{
        right: `${20 + (index * 60)}px`,
        top: `${100 + (index * 80)}px`
      }}
    >
      <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white px-4 py-3 rounded-full shadow-xl border-2 border-white max-w-xs">
        <div className="flex items-center space-x-2">
          <notification.icon size={16} />
          <span className="text-sm font-medium">{notification.text}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <style>{`
        @keyframes bubbleFloat {
          0% { transform: translateY(100px) scale(0); opacity: 0; }
          20% { transform: translateY(0) scale(1); opacity: 1; }
          80% { transform: translateY(-20px) scale(1); opacity: 1; }
          100% { transform: translateY(-100px) scale(0.8); opacity: 0; }
        }
        .bubble-animation {
          animation: bubbleFloat 4s ease-in-out forwards;
        }
      `}</style>

      {/* Bubble Notifications */}
      {bubbleNotifications.map((notification, index) => (
        <BubbleNotification key={notification.id} notification={notification} index={index} />
      ))}

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-800 to-orange-700 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">ALO</h1>
          <div className="flex space-x-4">
            <Bell 
              className="cursor-pointer hover:text-amber-200 transition-colors" 
              onClick={() => setNotifications([
                "🎁 Free t-shirts at Vendor Village in 10 min!",
                "⚠️ Thunderstorm expected at 8 PM",
                "🎵 Secret set announcement coming soon!"
              ])}
            />
            <MessageCircle 
              className="cursor-pointer hover:text-amber-200 transition-colors"
              onClick={() => setShowFeedback(true)}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-20">
        {currentPage === 'home' && activeTab === 'home' && (
          <div className="text-center">
            <FestivalSilhouette />
            <h2 className="text-3xl font-bold text-amber-900 mb-2">Your Festival Guide</h2>
            <p className="text-amber-700 mb-8">Navigate the magic, discover the moments</p>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-4 mb-8">
              <button
                onClick={() => setCurrentPage('festival-search')}
                className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:from-amber-700 hover:to-orange-700 transition-all transform hover:scale-105"
              >
                🔍 Search Festivals
              </button>
              <button
                onClick={findNearestFestival}
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:from-orange-700 hover:to-red-700 transition-all transform hover:scale-105"
              >
                📍 Find Nearest Festival
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-amber-200">
                <h3 className="font-bold text-amber-800">Pinned Shows</h3>
                <p className="text-2xl text-orange-600">{pinnedPerformers.length}</p>
                <p className="text-sm text-amber-600">Performers tracked</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-amber-200">
                <h3 className="font-bold text-amber-800">Festivals Nearby</h3>
                <p className="text-2xl text-orange-600">{festivals.length}</p>
                <p className="text-sm text-amber-600">Within 5 miles</p>
              </div>
            </div>

            {/* Notifications Panel */}
            {notifications.length > 0 && (
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 mb-6 border-2 border-amber-300">
                <h3 className="font-bold text-amber-800 mb-3 flex items-center">
                  <Bell className="mr-2" size={18} />
                  Live Updates
                </h3>
                {notifications.map((notif, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 mb-2 shadow-md border border-amber-200">
                    <p className="text-amber-800">{notif}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentPage === 'festival-search' && (
          <div>
            <div className="flex items-center mb-6">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-amber-600 hover:text-amber-800 mr-4"
              >
                ← Back
              </button>
              <h2 className="text-2xl font-bold text-amber-900">Search Festivals</h2>
            </div>
            <div className="space-y-4">
              {festivals.map(festival => (
                <div key={festival.id} className="bg-white rounded-xl p-4 shadow-lg border-2 border-amber-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-amber-900">{festival.name}</h3>
                      <p className="text-amber-700">{festival.location}</p>
                      <p className="text-sm text-amber-600">{festival.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-600 font-bold">{festival.distance}</p>
                      <p className="text-sm text-amber-600">away</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFestival(festival);
                      setCurrentPage('festival-detail');
                    }}
                    className="w-full bg-amber-500 text-white py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'festival-detail' && selectedFestival && (
          <div>
            <div className="flex items-center mb-6">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-amber-600 hover:text-amber-800 mr-4"
              >
                ← Back
              </button>
              <h2 className="text-2xl font-bold text-amber-900">{selectedFestival.name}</h2>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={findClosestEats}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl font-bold shadow-lg hover:from-green-600 hover:to-green-700 transition-all"
              >
                🍔 Closest Eats
              </button>
              <button
                onClick={findClosestBathrooms}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-bold shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all"
              >
                🚻 Bathrooms
              </button>
            </div>

            {/* Performers with Countdown */}
            <h3 className="text-xl font-bold text-amber-900 mb-4">Upcoming Performers</h3>
            <div className="space-y-4">
              {selectedFestival.performers.map(performer => {
                const isPinned = pinnedPerformers.some(p => p.id === performer.id);
                return (
                  <div key={performer.id} className="bg-white rounded-xl p-4 shadow-lg border-2 border-amber-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center mb-2">
                          <h4 className="font-bold text-lg text-amber-900 mr-2">{performer.name}</h4>
                          <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                            {performer.genre}
                          </span>
                        </div>
                        <p className="text-amber-700 text-sm mb-2">{performer.description}</p>
                        <div className="flex items-center text-sm text-amber-600">
                          <span className="mr-3">📍 {performer.stage}</span>
                          <span>🕐 {performer.time}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-center mb-3">
                          <p className="text-2xl font-bold text-orange-600">{performer.timeLeft}</p>
                          <p className="text-xs text-amber-600">until start</p>
                        </div>
                        <button
                          onClick={() => togglePinPerformer(performer)}
                          className={`px-4 py-2 rounded-full font-medium transition-all ${
                            isPinned 
                              ? 'bg-red-500 text-white hover:bg-red-600' 
                              : 'bg-amber-500 text-white hover:bg-amber-600'
                          }`}
                        >
                          {isPinned ? '📌 Pinned' : '📍 Pin'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pinned Performers Summary */}
            {pinnedPerformers.length > 0 && (
              <div className="mt-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 border-2 border-amber-300">
                <h3 className="font-bold text-amber-800 mb-3">📌 Your Pinned Performers ({pinnedPerformers.length})</h3>
                {pinnedPerformers.map(performer => (
                  <div key={performer.id} className="bg-white rounded-lg p-2 mb-2 shadow-sm">
                    <p className="text-amber-800 font-medium">{performer.name} - {performer.time}</p>
                  </div>
                ))}
                <p className="text-sm text-amber-600 mt-2">💡 You'll get alerts 15 minutes before each show!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'schedule' && currentPage === 'home' && (
          <div>
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Today's Lineup</h2>
            <div className="space-y-4">
              {[
                { time: "6:00 PM", artist: "Desert Winds", stage: "Main Stage", conflict: false },
                { time: "7:30 PM", artist: "Sunset Vibes", stage: "Main Stage", conflict: false },
                { time: "8:00 PM", artist: "Midnight Groove", stage: "Electronic Tent", conflict: true },
                { time: "9:30 PM", artist: "Cosmic Journey", stage: "Main Stage", conflict: false }
              ].map((show, index) => (
                <div key={index} className={`bg-white rounded-xl p-4 shadow-lg border-2 ${show.conflict ? 'border-red-300' : 'border-amber-200'}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg text-amber-900">{show.artist}</h3>
                      <p className="text-amber-700">{show.stage}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-orange-600">{show.time}</p>
                      {show.conflict && <p className="text-red-500 text-sm">⚠️ Conflict</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'map' && currentPage === 'home' && (
          <div>
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Festival Map</h2>
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-amber-200 h-96 flex items-center justify-center">
              <div className="text-center text-amber-700">
                <Map size={64} className="mx-auto mb-4 text-amber-500" />
                <h3 className="text-xl font-bold mb-2">Interactive Map</h3>
                <p>GPS navigation with real-time crowd density</p>
                <p className="text-sm mt-2">📍 You are here: Near Main Stage</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && currentPage === 'home' && (
          <div>
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Connect</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-amber-200">
                <h3 className="font-bold text-amber-800 mb-2">Friends at Festival</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-400 rounded-full"></div>
                    <span className="text-amber-800">Sarah • At Food Court</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
                    <span className="text-amber-800">Mike • Main Stage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-amber-900 mb-4">Send Feedback</h3>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Report issues or suggest improvements..."
              className="w-full h-32 p-3 border-2 border-amber-200 rounded-lg resize-none focus:border-amber-400 focus:outline-none"
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleFeedbackSubmit}
                className="flex-1 bg-amber-600 text-white py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors"
              >
                Send Feedback
              </button>
              <button
                onClick={() => setShowFeedback(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-amber-200 shadow-lg">
        <div className="flex justify-around py-2">
          {[
            { id: 'home', icon: Users, label: 'Home' },
            { id: 'schedule', icon: Calendar, label: 'Schedule' },
            { id: 'map', icon: Map, label: 'Map' },
            { id: 'social', icon: Users, label: 'Social' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? 'text-amber-600 bg-amber-100' 
                  : 'text-amber-500 hover:text-amber-600'
              }`}
            >
              <tab.icon size={24} />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ALOApp;