export default function VideoCard({ video, actions }) {
  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 rounded-2xl shadow-lg shadow-gray-200/50 dark:shadow-black/30 hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col border border-gray-100/50 dark:border-gray-800/50">
      
      {/* Thumbnail with Premium Overlay */}
      <div className="relative overflow-hidden bg-gray-900">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-40 object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out" 
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Animated Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="w-11 h-11 rounded-full bg-red-500/95 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 ease-out shadow-2xl ring-4 ring-white/20">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
        
        {/* Top Gradient Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
      </div>
      
      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col gap-1.5">
        
        {/* Title with Gradient Hover */}
        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm line-clamp-2 leading-relaxed transition-all duration-300 group-hover:text-red-500 dark:group-hover:text-red-400">
          {video.title}
        </h3>
        
        {/* Channel Row with Avatar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md ring-2 ring-white/20 dark:ring-gray-800/50">
              <span className="text-white text-[10px] font-bold">
                {video.channel_title?.charAt(0).toUpperCase() || 'YT'}
              </span>
            </div>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer">
              {video.channel_title}
            </p>
          </div>
          
          {/* View Count (if available) */}
          {video.view_count && (
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {video.view_count > 999 ? `${(video.view_count / 1000).toFixed(1)}K` : video.view_count}
              </p>
            </div>
          )}
        </div>
        
        {/* Date with Icon */}
        <div className="flex items-center gap-1.5">
          <svg className="w-3 h-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs text-gray-500 dark:text-gray-500 font-medium">
            {new Date(video.published_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        {/* Actions - UNTOUCHED, exactly as passed */}
        <div className="mt-2 pt-1 flex gap-2">
          {actions}
        </div>
      </div>
      
      {/* Bottom Indicator Line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-rose-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  )
}