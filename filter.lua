local function getDepth(url)
	local depth = 0
	for _ in string.gmatch(url, "/") do
		depth = depth + 1
	end
	return depth
end

local function link(el)
	el.target = string.gsub(el.target, "%.md", "")
	if not el.classes then
		el.classes = {}
	end

	table.insert(el.classes, "link-icon")
	return el
end

local function image(el)
	local depth = getDepth(PANDOC_STATE.input_files[1])
	local prefix = string.rep("../", depth - 6)
	el.src = prefix .. el.src
	print(el.src)

	return el
end

local function addAnchor(el)
	local id = pandoc.utils.stringify(el.content):gsub(" ", "-"):gsub("[^%w%-]", "")
	el.attributes.id = id
	return el.content
end

local function wikilink(el)
	local content = pandoc.utils.stringify(el):gsub("%[%[", ""):gsub("%]%]", "")
	local target = string.gsub(content, "%[%[", ""):gsub("%]%]", "") .. ".md"
	local link_element = pandoc.Link(content, target)
	return link(link_element);
end

local function matchWikilink(el)
	if el.text:match("%[%[.-%]%]") then
		return wikilink(el)
	end
	return el
end

return {
	Header = addAnchor,
	Link = link,
	Image = image,
	Str = matchWikilink
}
