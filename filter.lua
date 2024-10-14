local function getDepth(url)
	local depth = 0
	for _ in string.gmatch(url, "/") do
		depth = depth + 1
	end
	return depth
end

local function link(el)
	local depth  = getDepth(PANDOC_STATE.input_files[1])
	local prefix = string.rep("../", depth)
	el.target =  prefix .. string.gsub(el.target, "%.md", "")

	if not el.classes then
		el.classes = {}
	end
	table.insert(el.classes, "link-icon")

	return el
end

local function image(el)
	local depth = getDepth(PANDOC_STATE.input_files[1])
	local prefix = string.rep("../", depth)
	el.src = prefix .. el.src
	return el
end

return {
	Link = link,
	Image = image,
}
