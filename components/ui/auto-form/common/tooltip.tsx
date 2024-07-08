function AutoFormTooltip({ fieldConfigItem }: { fieldConfigItem: any }) {
  return (
    <>
      {fieldConfigItem?.description && (
        <div className="text-sm text-gray-500 dark:text-white">
          {fieldConfigItem.description}
        </div>
      )}
    </>
  )
}

export default AutoFormTooltip
