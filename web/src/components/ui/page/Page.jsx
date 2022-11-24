export default function Page({ children, header, rightSidebar, leftSidebar }) {
  return (
    <div className="flex flex-grow">
      {leftSidebar}
      {/* 고정 크기 넣어야 해서 넣음. */}
      <div className="w-1 break-words flex flex-col flex-grow">
        {header}
        <div
          className="h-full"
        >
          {children}
        </div>
      </div>
      {rightSidebar}
    </div>
  )

  /*return (
    <div className="flex flex-col flex-grow">
      {header}
      <div
        className="flex h-full"
        style={{ maxHeight: header ? 'calc(100% - 3rem)' : '100%' }}
      >
        {leftSidebar}
        <div className="flex flex-col flex-grow">{children}</div>
        {rightSidebar}
      </div>
    </div>
  )*/
}
